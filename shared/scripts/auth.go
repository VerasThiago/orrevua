//go:build mage
// +build mage

package main

import (
	"fmt"
	"time"

	"github.com/verasthiago/tickets-generator/shared/auth"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
)

func GenerateAdminToken() {
	sharedEnvConfigFile := &shared.EnvFileConfig{
		Path: "../.env",
		Name: "shared.local",
		Type: "env",
	}

	sharedFlags, err := new(shared.SharedFlags).InitFromViper(sharedEnvConfigFile)
	if err != nil {
		panic(err)
	}

	token, err := auth.GenerateJWT(&models.User{IsAdmin: true, IsVerified: true}, sharedFlags.JwtKey, time.Now().Add(10*time.Hour))
	if err != nil {
		panic(err)
	}

	fmt.Printf("Token: %+v\n", token)
}
