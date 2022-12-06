package ticket

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/validator/ticket"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type TicketSendAPI interface {
	Handler(context *gin.Context) error
}

type TicketSendHandler struct {
	builder.Builder
}

func (t *TicketSendHandler) InitFromBuilder(builder builder.Builder) *TicketSendHandler {
	t.Builder = builder
	return t
}

func (t *TicketSendHandler) Handler(context *gin.Context) error {
	var err error
	var user *models.User
	var ticketList []*models.Ticket
	var request *ticket.TicketSendRequest

	if err = context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.ValidateSyntax(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), t.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(request.Token.User); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if user, err = t.GetRepository().GetUserByID(request.UserID); err != nil {
		return err
	}

	if ticketList, err = t.GetRepository().GetTicketListByUserID(user.ID); err != nil {
		return err
	}

	if err = t.GetEmailClient().SendTicketsToUser(user, ticketList); err != nil {
		return err
	}

	context.JSON(http.StatusCreated, gin.H{"status": "success"})
	return nil
}
