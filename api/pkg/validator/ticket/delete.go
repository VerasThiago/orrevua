package ticket

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type DeleteRequest struct {
	TicketID string `json:"id"`
	Token    *auth.JWTClaim
}

func (d *DeleteRequest) ValidateSyntax() []string {
	rules := govalidator.MapData{
		"id": []string{"required", "uuid"},
	}

	options := govalidator.Options{
		Data:  d,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues(validator.GetRulesKey(rules), values)
}

func (d *DeleteRequest) ValidateSemantic() []string {
	var errors []string

	if !d.Token.User.IsAdmin {
		errors = append(errors, "Only admin can execute this operation")
	}

	return errors
}
