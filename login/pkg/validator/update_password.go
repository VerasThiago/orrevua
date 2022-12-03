package validator

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type UpdatePasswordRequest struct {
	Password string `json:"password"`
}

func (r *UpdatePasswordRequest) Validate() []string {
	rules := govalidator.MapData{
		"password": []string{"required"},
	}
	options := govalidator.Options{
		Data:  r,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues([]string{"password"}, values)
}
