package cmd

import (
	"github.com/verasthiago/tickets-generator/login/pkg"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
)

func Execute() {
	sharedEnvConfigFile := shared.GetSharedFileConfigFromEnv()
	loginEnvConfigFile := builder.GetLoginFileConfigFromEnv()
	builder := new(builder.ServerBuilder).InitBuilder(loginEnvConfigFile, sharedEnvConfigFile)
	server := new(pkg.Server).InitFromBuilder(builder)

	if err := server.Run(); err != nil {
		panic(err)
	}
}
