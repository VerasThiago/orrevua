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

type TicketListAPI interface {
	Handler(context *gin.Context) error
}

type TicketListHandler struct {
	builder.Builder
}

func (l *TicketListHandler) InitFromBuilder(builder builder.Builder) *TicketListHandler {
	l.Builder = builder
	return l
}
func (l *TicketListHandler) Handler(context *gin.Context) error {
	var err error
	var user *models.User
	var ticketList []*models.Ticket
	request := ticket.ListRequest{
		UserID: context.Param("userid"),
	}

	if errList := request.ValidateSyntax(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), l.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if user, err = l.GetRepository().GetUserByID(request.UserID); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(user); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if ticketList, err = l.GetRepository().GetTicketListByUserID(request.UserID); err != nil {
		return err
	}

	if len(ticketList) == 0 {
		if ticket, err := l.GetRepository().GetTicketByCPF(user.CPF); err == nil {
			ticketList = append(ticketList, ticket)
		}
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "data": ticketList})
	return nil
}
