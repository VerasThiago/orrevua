package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type GetUserAPI interface {
	Handler(context *gin.Context) error
}

type GetUserHandler struct {
	builder.Builder
}

func (u *GetUserHandler) InitFromBuilder(builder builder.Builder) *GetUserHandler {
	u.Builder = builder
	return u
}
func (u *GetUserHandler) Handler(context *gin.Context) error {
	var err error
	var user *models.User
	request := validator.GetUserRequest{
		UserID: context.Param("userid"),
	}

	if errList := request.ValidateSyntax(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), u.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if user, err = u.GetRepository().GetUserWithTicketsByID(request.UserID); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "data": user})
	return nil
}
