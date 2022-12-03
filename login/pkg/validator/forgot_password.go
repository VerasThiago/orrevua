package validator

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

func (f *ForgotPasswordRequest) Validate() []string {
	rules := govalidator.MapData{
		"email": []string{"required", "email"},
	}

	options := govalidator.Options{
		Data:  f,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues([]string{"email"}, values)
}
