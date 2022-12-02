package validator

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/models"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type UpdateRequest struct {
	*models.User
}

func (u *UpdateRequest) Validate() []string {
	rules := govalidator.MapData{
		"id":       []string{"required", "uuid"},
		"name":     []string{"alpha"},
		"username": []string{"alpha_dash"},
		"email":    []string{"email"},
		"password": []string{},
		"cpf": 		[]string{"cpf"},
	}

	options := govalidator.Options{
		Data:  u,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues([]string{"id", "name", "username", "email", "password", "cpf"}, values)
}
