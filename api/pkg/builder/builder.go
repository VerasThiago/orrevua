package builder

import (
	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/repository"
	"go.uber.org/zap"
)

type Builder interface {
	GetRepository() repository.Repository
	GetFlags() *Flags
	GetLog() *zap.Logger
	GetSharedFlags() *shared.SharedFlags
	InitBuilder() Builder
}
