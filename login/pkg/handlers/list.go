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

type ListUserAPI interface {
	Handler(context *gin.Context) error
}

type ListUserHandler struct {
	builder.Builder
}

func (u *ListUserHandler) InitFromBuilder(builder builder.Builder) *ListUserHandler {
	u.Builder = builder
	return u
}
func (u *ListUserHandler) Handler(context *gin.Context) error {
	var err error
	var userList []*models.User
	request := validator.ListUserRequest{}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), u.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if userList, err = u.GetRepository().GetAllUsers(); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "data": userList})
	return nil
}
