package ticket

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/models"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type CreateRequest struct {
	*models.Ticket
	Token *auth.JWTClaim
}

func (c *CreateRequest) ValidateSyntax() []string {
	rules := govalidator.MapData{
		"ownerid": []string{"required", "uuid"},
		"name":    []string{"required", "alpha_space"},
		"email":   []string{"required", "email"},
		"cpf":     []string{"required"},
	}

	options := govalidator.Options{
		Data:  c,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues(validator.GetRulesKey(rules), values)
}

func (c *CreateRequest) ValidateSemantic(user *models.User) []string {
	var errors []string

	if !c.Token.User.IsAdmin {
		errors = append(errors, "Only admin can execute this operation")
	}

	return errors
}
