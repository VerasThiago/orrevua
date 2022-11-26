package cmd

import (
	"github.com/verasthiago/tickets-generator/api/pkg"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
)

func Execute() {
	builder := new(builder.ServerBuilder).InitBuilder()
	server := new(pkg.Server).InitFromBuilder(builder)

	if err := server.Run(); err != nil {
		panic(err)
	}
}
