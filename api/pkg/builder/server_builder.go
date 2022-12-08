package builder

import (
	"github.com/verasthiago/tickets-generator/shared/clients/email"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/repository"
	postgresrepository "github.com/verasthiago/tickets-generator/shared/repository/postgresRepository"
	"go.uber.org/zap"
)

type ServerBuilder struct {
	*Flags
	*shared.SharedFlags
	Repository repository.Repository
	Email      email.SMTPClient
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

func (s *ServerBuilder) GetEmailClient() email.SMTPClient {
	return s.Email
}

func (s *ServerBuilder) InitBuilder(apiEnvFileConfig, sharedEnvFileConfig *shared.EnvFileConfig) Builder {
	flags, err := new(Flags).InitFromViper(apiEnvFileConfig)
	if err != nil {
		panic(err)
	}
	s.Flags = flags

	sharedFlags, err := new(shared.SharedFlags).InitFromViper(sharedEnvFileConfig)
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
	s.Email = new(email.SMTP).InitFromFlags(s.SharedFlags)

	return s
}
