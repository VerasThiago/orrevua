package validator

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/login/pkg/constants"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type ValidateTokenRequest struct {
	Token string `json:"token"`
}

func (s *ValidateTokenRequest) Validate() []string {
	rules := govalidator.MapData{
		"token": []string{"required", constants.TOKEN_REGEX},
	}

	options := govalidator.Options{
		Data:  s,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues([]string{"token"}, values)
}
