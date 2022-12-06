package validator

import (
	"github.com/verasthiago/tickets-generator/shared/auth"
)

type ListUserRequest struct {
	Token *auth.JWTClaim
}

func (l *ListUserRequest) ValidateSemantic() []string {
	var errors []string

	if !l.Token.User.IsAdmin {
		errors = append(errors, "Only admin can execute this operation")
	}

	return errors
}
