package ticket

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/validator/ticket"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type TicketCreateAPI interface {
	Handler(context *gin.Context) error
}

type TicketCreateHandler struct {
	builder.Builder
}

func (c *TicketCreateHandler) InitFromBuilder(builder builder.Builder) *TicketCreateHandler {
	c.Builder = builder
	return c
}

func GenerateNewTicketUrl(sharedFlags *flags.SharedFlags, apiFlags *builder.Flags) string {
	if sharedFlags.Deploy == flags.DEPLOY_LOCAL {
		return fmt.Sprintf("%s:%s/tickets", sharedFlags.AppHost, apiFlags.WebPort)
	}
	return fmt.Sprintf("%s/tickets", sharedFlags.AppHost)
}

func (c *TicketCreateHandler) Handler(context *gin.Context) error {
	var err error
	var user *models.User
	var request *ticket.CreateRequest

	if err = context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.ValidateSyntax(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), c.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(request.Token.User); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if user, err = c.GetRepository().GetUserByID(request.Ticket.OwnerID); err != nil {
		return err
	}

	if err = c.GetRepository().CreateTicket(request.Ticket); err != nil {
		return err
	}

	url := GenerateNewTicketUrl(c.GetSharedFlags(), c.GetFlags())
	if err = c.GetEmailClient().SendNewTicketToUser(user, request.Ticket, url); err != nil {
		return err
	}

	context.JSON(http.StatusCreated, gin.H{"status": "success", "id": request.Ticket.ID})
	return nil
}
