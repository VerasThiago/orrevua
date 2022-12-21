//go:build mage
// +build mage

package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
	"github.com/verasthiago/tickets-generator/shared/repository"
	postgresrepository "github.com/verasthiago/tickets-generator/shared/repository/postgresRepository"
)

func decodeFromCSV(data []string) *models.Ticket {
	return &models.Ticket{Name: strings.TrimSpace(data[0]), Email: strings.TrimSpace(data[2]), CPF: strings.TrimSpace(data[3])}
}

func getSharedFlags() *shared.SharedFlags {
	sharedEnvConfigFile := &shared.EnvFileConfig{
		Path: "../.env",
		Name: fmt.Sprintf("shared.%+v", shared.GetDeployEnv()),
		Type: "env",
	}

	sharedFlags, err := new(shared.SharedFlags).InitFromViper(sharedEnvConfigFile)
	if err != nil {
		panic(err)
	}
	return sharedFlags
}

func getDBInstance(sharedFlags *shared.SharedFlags) repository.Repository {
	return new(postgresrepository.PostgresRepository).InitFromFlags(sharedFlags)
}

func createTicket(ticket *models.Ticket, url string, totalTickets *int, totalNewTickets *int, token string) {
	method := "POST"

	payload := strings.NewReader(fmt.Sprintf(`{
	  "ownerid": "%+v",
	  "name": "%+v",
	  "email": "%+v",
	  "cpf": "%+v"
  	}`, ticket.OwnerID, ticket.Name, ticket.Email, ticket.CPF))

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
		return
	}
	req.Header.Add("Authorization", token)
	req.Header.Add("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	reqReponse := struct {
		Error struct {
			Type string `json:"type"`
		} `json:"error"`
		Status string `json:"status"`
	}{}

	json.Unmarshal(body, &reqReponse)

	if reqReponse.Status == "success" {
		*totalNewTickets++
		*totalTickets++
	} else if reqReponse.Error.Type == errors.DATA_ALREADY_BEGIN_USED.Type {
		*totalTickets++
	}
}

func generateToken(shared *shared.SharedFlags) string {
	token, err := auth.GenerateJWT(&models.User{Name: "script-user", IsAdmin: true}, shared.JwtKey, time.Now().Add(1*time.Hour))
	if err != nil {
		panic(err)
	}
	return token
}

func GenerateCreateTicketUrl(sharedFlags *shared.SharedFlags) string {
	if sharedFlags.Deploy == shared.DEPLOY_LOCAL {
		return "localhost:8080/api/v0/ticket/create"
	}
	return "https://orrevua-api.fly.dev/api/v0/ticket/create"
}

func CreateTickets() {
	totalTickets := 0
	totalNewTickets := 0
	filePath := "paid_guests.csv"
	sharedFlags := getSharedFlags()
	db := getDBInstance(sharedFlags)
	token := generateToken(sharedFlags)
	url := GenerateCreateTicketUrl(sharedFlags)

	var err error
	var availabilityFile *os.File
	if availabilityFile, err = os.Open(filePath); err != nil {
		panic(err)
	}

	defer availabilityFile.Close()

	csvReader := csv.NewReader(availabilityFile)
	records, err := csvReader.ReadAll()
	if err != nil {
		panic(err)
	}

	ticketList := []*models.Ticket{}

	for _, rec := range records {
		ticket := decodeFromCSV(rec)

		// If user have * on name it will create the ticket to the previous user
		if ticket.Name[len(ticket.Name)-1] == '*' {
			if lastTicket := ticketList[len(ticketList)-1]; lastTicket != nil {
				ticket.OwnerID = lastTicket.OwnerID
				ticket.Name = strings.TrimSuffix(ticket.Name, "*")
			} else {
				ticket = nil
			}
		} else {
			if user, err := db.GetUserByEmail(ticket.Email); err == nil {
				ticket.OwnerID = user.ID
			} else {
				ticket = nil
			}
		}
		if ticket != nil {
			createTicket(ticket, url, &totalTickets, &totalNewTickets, token)
		}
		ticketList = append(ticketList, ticket)
	}

	fmt.Printf("Success!\n")
	fmt.Printf("Total tickets: %+v\n", totalTickets)
	fmt.Printf("Total new tickets: %+v\n", totalNewTickets)
}
