package builder

import (
	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/repository"
	postgresrepository "github.com/verasthiago/tickets-generator/shared/repository/postgresRepository"
	"go.uber.org/zap"
)

type ServerBuilder struct {
	*Flags
	*shared.SharedFlags
	Repository repository.Repository
	Log        *zap.Logger
}

func (s *ServerBuilder) GetFlags() *Flags {
	return s.Flags
}

func (s *ServerBuilder) GetSharedFlags() *shared.SharedFlags {
	return s.SharedFlags
}

func (s *ServerBuilder) GetRepository() repository.Repository {
	return s.Repository
}

func (s *ServerBuilder) GetLog() *zap.Logger {
	return s.Log
}

func (s *ServerBuilder) InitBuilder() Builder {
	flags, err := new(Flags).InitFromViper()
	if err != nil {
		panic(err)
	}
	s.Flags = flags

	sharedFlags, err := new(shared.SharedFlags).InitFromViper()
	if err != nil {
		panic(err)
	}

	log, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	s.SharedFlags = sharedFlags
	s.Log = log
	s.Repository = new(postgresrepository.PostgresRepository).InitFromFlags(s.SharedFlags)

	return s
}
