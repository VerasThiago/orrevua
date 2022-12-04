package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/constants"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
)

type ForgotPasswordAPI interface {
	Handler(context *gin.Context) error
}

type ForgotPasswordHandler struct {
	builder.Builder
}

func (f *ForgotPasswordHandler) InitFromBuilder(builder builder.Builder) *ForgotPasswordHandler {
	f.Builder = builder
	return f
}

func GeneratePasswordResetUrl(host string, token string) string {
	return fmt.Sprintf("%s/password/reset?token=%s", host, token)
}

func (f *ForgotPasswordHandler) Handler(context *gin.Context) error {
	var request *validator.ForgotPasswordRequest
	var err error
	var tokenString string

	if err := context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.Validate(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if tokenString, err = auth.GenerateJWT(&models.User{Email: request.Email}, f.GetSharedFlags().JwtKeyEmail, time.Now().Add(constants.RESET_PASSWORD_TOKEN_EXPIRE_TIME)); err != nil {
		return err
	}

	url := GeneratePasswordResetUrl(f.GetSharedFlags().AppHost, tokenString)

	if err := f.GetEmailClient().SendForgotPasswordURLToUserByEmail(models.User{Email: request.Email}, url); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "url": url, "token": tokenString})
	return nil
}
