package validator

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type GetUserRequest struct {
	UserID string `json:"userid"`
	Token  *auth.JWTClaim
}

func (l *GetUserRequest) ValidateSyntax() []string {
	rules := govalidator.MapData{
		"userid": []string{"required", "uuid"},
	}

	options := govalidator.Options{
		Data:  l,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues(validator.GetRulesKey(rules), values)
}

func (l *GetUserRequest) ValidateSemantic() []string {
	var errors []string

	if l.Token.User.IsAdmin {
		return errors
	}

	if l.UserID != l.Token.User.ID {
		errors = append(errors, "user can't execute this operation on account of other users")
	}

	return errors
}
