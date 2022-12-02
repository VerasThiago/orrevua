package validator

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type ConfirmEmailRequest struct {
	ID string `json:"id"`
}

func (c *ConfirmEmailRequest) Validate() []string {
	rules := govalidator.MapData{
		"id": []string{"required", "id"},
	}

	options := govalidator.Options{
		Data:  c,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()

	return validator.MergeUrlValues([]string{"email"}, values)
}
