//go:build mage
// +build mage

package main

import (
	"fmt"

	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
	postgresrepository "github.com/verasthiago/tickets-generator/shared/repository/postgresRepository"
)

func MigrateUserDatabase() {
	sharedEnvConfigFile := &shared.EnvFileConfig{
		Path: "../.env",
		Name: "shared.local",
		Type: "env",
	}

	sharedFlags, err := new(shared.SharedFlags).InitFromViper(sharedEnvConfigFile)
	if err != nil {
		panic(err)
	}

	db := new(postgresrepository.PostgresRepository).InitFromFlags(sharedFlags)

	db.MigrateUser(&models.User{})

	fmt.Println("Migration done!")
}

func MigrateApiDatabase() {
	sharedEnvConfigFile := &shared.EnvFileConfig{
		Path: "../.env",
		Name: "shared.local",
		Type: "env",
	}

	sharedFlags, err := new(shared.SharedFlags).InitFromViper(sharedEnvConfigFile)
	if err != nil {
		panic(err)
	}

	db := new(postgresrepository.PostgresRepository).InitFromFlags(sharedFlags)

	db.MigrateTicket(&models.Ticket{})

	fmt.Println("Migration done!")
}
