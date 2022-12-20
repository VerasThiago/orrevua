//go:build mage
// +build mage

package main

import (
	"fmt"
	"time"

	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
	postgresrepository "github.com/verasthiago/tickets-generator/shared/repository/postgresRepository"
)

var UserList []*models.User = []*models.User{
	{
		Name:     "Thiago Veras Machado",
		Email:    "thiago.wortnnes@gmail.com",
		CPF:      "02602602620",
		Password: "123456",
		TicketList: []*models.Ticket{
			{
				Name:   "Thiago Veras Machado",
				Email:  "thiago.wortnnes@gmail.com",
				CPF:    "02602602620",
				IsUsed: false,
			},
			{
				Name:   "Vinicius Junior",
				Email:  "vinicin@gmail.com",
				CPF:    "02602602621",
				IsUsed: false,
			},
			{
				Name:     "Neymar Junior",
				Email:    "nj@gmail.com",
				CPF:      "02602602622",
				IsUsed:   true,
				UsedTime: time.Date(2022, 12, 7, 3, 30, 00, 0, time.Local),
			},
		},
		IsAdmin:    true,
		IsVerified: true,
	},
	{
		Name:     "Rodrigo Cunha Lima",
		Email:    "limarodrigoo@outlook.com",
		CPF:      "12602602620",
		Password: "123456",
		TicketList: []*models.Ticket{
			{
				Name:     "Rodrigo Cunha Lima",
				Email:    "limarodrigoo@outlook.com",
				CPF:      "12602602620",
				IsUsed:   true,
				UsedTime: time.Date(2022, 12, 7, 1, 33, 25, 0, time.Local),
			},
			{
				Name:     "Otaku Sem Banho",
				Email:    "naruto.de.juliet@gmail.com",
				CPF:      "12602602621",
				IsUsed:   true,
				UsedTime: time.Date(2022, 12, 7, 1, 35, 33, 0, time.Local),
			},
		},
		IsAdmin:    true,
		IsVerified: true,
	},
	{
		Name:     "Diogo The Pontes",
		Email:    "diogo_pontes_95@hotmail.com",
		CPF:      "22602602620",
		Password: "123456",
		TicketList: []*models.Ticket{
			{
				Name:   "Diogo The Pontes",
				Email:  "diogo_pontes_95@hotmail.com",
				CPF:    "22602602620",
				IsUsed: false,
			},
			{
				Name:   "Lia Otaku",
				Email:  "lia.otaku@gmail.com",
				CPF:    "22602602621",
				IsUsed: false,
			},
		},
		IsAdmin:    true,
		IsVerified: true,
	},
	{
		Name:     "Pedro Yhago De Sa Machado",
		Email:    "pedroyhago@gmail.com",
		CPF:      "32602602620",
		Password: "123456",
		TicketList: []*models.Ticket{
			{
				Name:   "Pedro Yhago De Sa Machados",
				Email:  "pedroyhago@gmail.com",
				CPF:    "32602602620",
				IsUsed: false,
			},
		},
		IsAdmin:    false,
		IsVerified: true,
	},
}

func PopulateDB() {
	sharedEnvConfigFile := &shared.EnvFileConfig{
		Path: "../.env",
		Name: fmt.Sprintf("shared.%+v", shared.GetDeployEnv()),
		Type: "env",
	}

	sharedFlags, err := new(shared.SharedFlags).InitFromViper(sharedEnvConfigFile)
	if err != nil {
		panic(err)
	}

	db := new(postgresrepository.PostgresRepository).InitFromFlags(sharedFlags)

	for _, user := range UserList {
		user.HashPassword(user.Password)
		if err := db.CreateUser(user); err != nil {
			panic(err)
		}
	}
	fmt.Printf("\n\nDB populated with success!!\n\n")
}
