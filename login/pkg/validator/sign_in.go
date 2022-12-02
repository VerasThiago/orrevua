package validator

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type SignInRequest struct {
	CPF    	 string `json:"cpf"`
	Password string `json:"password"`
}

func (s *SignInRequest) Validate() []string {
	rules := govalidator.MapData{
		"cpf":      []string{"required"},
		"password": []string{"required"},
	}

	options := govalidator.Options{
		Data:  s,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues([]string{"cpf", "password"}, values)
}