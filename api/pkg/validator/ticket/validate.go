package ticket

import (
	"fmt"

	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/models"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type ValidateRequest struct {
	TicketCPF string `json:"cpf"`
	Token     *auth.JWTClaim
	Ticket    *models.Ticket
}

func (d *ValidateRequest) ValidateSyntax() []string {
	rules := govalidator.MapData{
		"cpf": []string{"required"},
	}

	options := govalidator.Options{
		Data:  d,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues(validator.GetRulesKey(rules), values)
}

func (d *ValidateRequest) ValidateSemantic() []string {
	var errors []string

	if !d.Token.User.IsAdmin {
		errors = append(errors, "Only admin can execute this operation")
		return errors
	}

	if d.Ticket.IsUsed {
		errors = append(errors, fmt.Sprintf("Ticket already validated at %+v", d.Ticket.UsedTime))
	}

	return errors
}
