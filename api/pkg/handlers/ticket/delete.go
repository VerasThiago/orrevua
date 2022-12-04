package ticket

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/validator/ticket"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
)

type TicketDeleteAPI interface {
	Handler(context *gin.Context) error
}

type TicketDeleteHandler struct {
	builder.Builder
}

func (d *TicketDeleteHandler) InitFromBuilder(builder builder.Builder) *TicketDeleteHandler {
	d.Builder = builder
	return d
}

func (d *TicketDeleteHandler) Handler(context *gin.Context) error {
	var err error
	var request *ticket.DeleteRequest

	if err = context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.ValidateSyntax(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), d.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if _, err = d.GetRepository().GetTicketByID(request.TicketID); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if err = d.GetRepository().DeleteTicketByID(request.TicketID); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success"})
	return nil
}
