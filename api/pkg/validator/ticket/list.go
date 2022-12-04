package ticket

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/models"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type ListRequest struct {
	UserID string `json:"userid"`
	Token  *auth.JWTClaim
}

func (l *ListRequest) ValidateSyntax() []string {
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

func (l *ListRequest) ValidateSemantic(user *models.User) []string {
	var errors []string

	if l.Token.User.IsAdmin {
		return errors
	}

	if user.ID != l.Token.User.ID {
		errors = append(errors, "user can't execute this operation on account of other users")
	}

	return errors
}
