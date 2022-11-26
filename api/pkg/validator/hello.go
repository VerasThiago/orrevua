package validator

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *SignInRequest) Validate() []string {
	rules := govalidator.MapData{
		"email":    []string{"required", "email"},
		"password": []string{"required"},
	}

	options := govalidator.Options{
		Data:  s,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues([]string{"email", "password"}, values)
}
