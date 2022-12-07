package cmd

import (
	"github.com/verasthiago/tickets-generator/api/pkg"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
)

func Execute() {
	sharedEnvConfigFile := shared.GetSharedFileConfigFromEnv()
	apiEnvConfigFile := builder.GetApiFileConfigFromEnv()
	builder := new(builder.ServerBuilder).InitBuilder(apiEnvConfigFile, sharedEnvConfigFile)
	server := new(pkg.Server).InitFromBuilder(builder)

	if err := server.Run(); err != nil {
		panic(err)
	}
}
