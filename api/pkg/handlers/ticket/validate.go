package ticket

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	validator "github.com/verasthiago/tickets-generator/api/pkg/validator/ticket"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	postgresrepository "github.com/verasthiago/tickets-generator/shared/repository/postgresRepository"
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
	var request *validator.ValidateRequest

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

	//TODO: Generate this error inside validate semantic
	if request.Ticket.IsUsed {
		return errors.GenericError{
			Code:    errors.STATUS_BAD_REQUEST,
			Type:    errors.DATA_ALREADY_BEGIN_USED.Type,
			Message: errors.DATA_ALREADY_BEGIN_USED.Message,
			MetaData: map[string]interface{}{
				"time": request.Ticket.UsedTime.String(),
				"name": request.Ticket.Name,
				"variables": []map[string]interface{}{
					{
						"path": errors.BuildI18NPath(errors.I18N_FIELDS, postgresrepository.TICKET_DATA_NAME),
					},
				},
			},
		}
	}

	if err = c.GetRepository().ValidateTicketByCPF(request.TicketCPF); err != nil {
		return err
	}

	context.JSON(http.StatusCreated, gin.H{"status": "success", "name": request.Ticket.Name})
	return nil
}
