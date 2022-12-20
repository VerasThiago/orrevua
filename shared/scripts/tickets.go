//go:build mage
// +build mage

package main

import (
	"encoding/csv"
	"errors"
	"fmt"
	"os"
	"strings"

	aux "github.com/verasthiago/tickets-generator/shared/errors"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
	"github.com/verasthiago/tickets-generator/shared/repository"
	postgresrepository "github.com/verasthiago/tickets-generator/shared/repository/postgresRepository"
)

func decodeFromCSV(data []string) *models.Ticket {
	return &models.Ticket{Name: strings.TrimSpace(data[0]), Email: strings.TrimSpace(data[2]), CPF: strings.TrimSpace(data[3])}
}

func getDBInstance() repository.Repository {
	sharedEnvConfigFile := &shared.EnvFileConfig{
		Path: "../.env",
		Name: fmt.Sprintf("shared.%+v", shared.GetDeployEnv()),
		Type: "env",
	}

	sharedFlags, err := new(shared.SharedFlags).InitFromViper(sharedEnvConfigFile)
	if err != nil {
		panic(err)
	}

	return new(postgresrepository.PostgresRepository).InitFromFlags(sharedFlags)
}

func createTicket(ticket *models.Ticket, db repository.Repository, totalTickets *int, totalNewTickets *int) {
	err := db.CreateTicket(ticket)
	if err == nil {
		*totalNewTickets++
		*totalTickets++
	} else if errors.As(err, &aux.GenericError{}) && err.(aux.GenericError).Type == aux.DATA_ALREADY_BEGIN_USED.Type {
		*totalTickets++
	}
}

func CreateTickets() {
	totalTickets := 0
	totalNewTickets := 0
	db := getDBInstance()
	filePath := "pagos.csv"

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
			createTicket(ticket, db, &totalTickets, &totalNewTickets)
		}
		ticketList = append(ticketList, ticket)
	}

	fmt.Printf("Success!\n")
	fmt.Printf("Total tickets: %+v\n", totalTickets)
	fmt.Printf("Total new tickets: %+v\n", totalNewTickets)
}
