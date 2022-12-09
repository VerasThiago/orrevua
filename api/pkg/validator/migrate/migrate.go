package migrate

import (
	"github.com/verasthiago/tickets-generator/shared/auth"
)

type MigrateRequest struct {
	Token *auth.JWTClaim
}

func (m *MigrateRequest) ValidateSemantic() []string {
	var errors []string

	if !m.Token.User.IsAdmin {
		errors = append(errors, "only Admin can execute this action")
	}

	return errors
}
