package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/models"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	error_handler "github.com/verasthiago/tickets-generator/shared/errors"
)

type ForgotPasswordAPI interface {
	Handler(context *gin.Context)
}

type ForgotPasswordHandler struct {
	builder.Builder
}

const RESET_PASSWORD_TOKEN_EXPIRE_TIME = 15 * time.Minute

func (f *ForgotPasswordHandler) InitFromBuilder(builder builder.Builder) *ForgotPasswordHandler {
	f.Builder = builder
	return f
}

func GeneratePasswordResetUrl(host string, token string) string {
	return fmt.Sprintf("%s/password/reset?token=%s", host, token)
}

func (f *ForgotPasswordHandler) Handler(context *gin.Context) {
	var request *validator.ForgotPasswordRequest
	var err error
	var tokenString string

	if err := context.ShouldBindJSON(&request); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if errors := request.Validate(); len(errors) > 0 {
		error_handler.HandleBadRequestErrors(context, errors)
		return
	}

	if tokenString, err = auth.GenerateJWT(&models.User{Email: request.Email}, f.GetSharedFlags().JwtKeyEmail, time.Now().Add(RESET_PASSWORD_TOKEN_EXPIRE_TIME)); err != nil {
		error_handler.HandleInternalServerError(context, err, f.GetLog())
		return
	}

	url := GeneratePasswordResetUrl(f.GetSharedFlags().AppHost, tokenString)

	if err := f.GetEmailClient().SendForgotPasswordURLToUserByEmail(models.User{Email: request.Email}, url); err != nil {
		error_handler.HandleInternalServerError(context, err, f.GetLog())
		return
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "url": url})
}
