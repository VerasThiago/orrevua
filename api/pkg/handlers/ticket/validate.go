package ticket

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/validator/ticket"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
)

type TicketValidateAPI interface {
	Handler(context *gin.Context) error
}

type TicketValidateHandler struct {
	builder.Builder
}

func (c *TicketValidateHandler) InitFromBuilder(builder builder.Builder) *TicketValidateHandler {
	c.Builder = builder
	return c
}

func (c *TicketValidateHandler) Handler(context *gin.Context) error {
	var err error
	var request *ticket.ValidateRequest

	if err = context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.ValidateSyntax(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), c.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if request.Ticket, err = c.GetRepository().GetTicketByCPF(request.TicketCPF); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if err = c.GetRepository().ValidateTicketByCPF(request.TicketCPF); err != nil {
		return err
	}

	context.JSON(http.StatusCreated, gin.H{"status": "success"})
	return nil
}
