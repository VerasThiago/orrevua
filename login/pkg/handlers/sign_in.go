package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/constants"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
	"golang.org/x/crypto/bcrypt"
)

type LoginUserAPI interface {
	Handler(context *gin.Context) error
}

type LoginUserHandler struct {
	builder.Builder
}

func (l *LoginUserHandler) InitFromBuilder(builder builder.Builder) *LoginUserHandler {
	l.Builder = builder
	return l
}
func (l *LoginUserHandler) Handler(context *gin.Context) error {
	var err error
	var user *models.User
	var tokenString string
	var request validator.SignInRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.Validate(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if user, err = l.GetRepository().GetUserByEmail(request.Email); err != nil {
		return err
	}

	if !user.IsVerified {
		return errors.GenericError{
			Code:    errors.STATUS_UNAUTHORIZED,
			Type:    errors.UNVERIFIED_ACCOUNT.Type,
			Message: errors.UNVERIFIED_ACCOUNT.Message,
		}
	}

	if err := user.CheckPassword(request.Password); err != nil {
		if err == bcrypt.ErrMismatchedHashAndPassword {
			return errors.GenericError{
				Code:    errors.STATUS_UNAUTHORIZED,
				Type:    errors.INVALID_PASSWORD.Type,
				Message: errors.INVALID_PASSWORD.Message,
			}
		}
		return err
	}

	if tokenString, err = auth.GenerateJWT(user, l.GetSharedFlags().JwtKey, time.Now().Add(constants.APP_TOKEN_EXPIRE_TIME)); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "token": tokenString})
	return nil
}
