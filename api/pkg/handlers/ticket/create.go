package ticket

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/validator/ticket"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
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

func (c *TicketCreateHandler) Handler(context *gin.Context) error {
	var err error
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

	request.ID = request.Token.User.ID

	if err = c.GetRepository().CreateTicket(request.Ticket); err != nil {
		return err
	}

	context.JSON(http.StatusCreated, gin.H{"status": "success", "id": request.ID})
	return nil
}
