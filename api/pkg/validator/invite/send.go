package invite

import (
	"github.com/thedevsaddam/govalidator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/models"
	"github.com/verasthiago/tickets-generator/shared/validator"
)

type InviteSendRequest struct {
	UserID string `json:"userid"`
	Token  *auth.JWTClaim
}

func (i *InviteSendRequest) ValidateSyntax() []string {
	rules := govalidator.MapData{
		"userid": []string{"required", "uuid"},
	}

	options := govalidator.Options{
		Data:  i,
		Rules: rules,
	}

	values := govalidator.New(options).ValidateStruct()
	return validator.MergeUrlValues(validator.GetRulesKey(rules), values)
}

func (i *InviteSendRequest) ValidateSemantic(user *models.User) []string {
	var errors []string

	if !i.Token.User.IsAdmin {
		errors = append(errors, "Only admin can execute this operation")
	}

	return errors
}
