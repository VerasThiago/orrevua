package invite

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/validator/invite"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type InviteSendAPI interface {
	Handler(context *gin.Context) error
}

type InviteSendHandler struct {
	builder.Builder
}

func (i *InviteSendHandler) InitFromBuilder(builder builder.Builder) *InviteSendHandler {
	i.Builder = builder
	return i
}

func (i *InviteSendHandler) Handler(context *gin.Context) error {
	var err error
	var user *models.User
	var request *invite.InviteSendRequest

	if err = context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.ValidateSyntax(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), i.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(request.Token.User); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if user, err = i.GetRepository().GetUserByID(request.UserID); err != nil {
		return err
	}

	if err = i.GetEmailClient().SendInviteToUser(user); err != nil {
		return err
	}

	context.JSON(http.StatusCreated, gin.H{"status": "success"})
	return nil
}
