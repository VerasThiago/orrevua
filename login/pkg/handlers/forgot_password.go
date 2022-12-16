package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/flags"
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

func GeneratePasswordResetUrl(sharedFlags *flags.SharedFlags, apiFlags *builder.Flags, token string) string {
	if sharedFlags.Deploy == flags.DEPLOY_LOCAL {
		return fmt.Sprintf("%s:%s/password/reset?token=%s", sharedFlags.AppHost, apiFlags.WebPort, token)
	}
	return fmt.Sprintf("%s/password/reset?token=%s", sharedFlags.AppHost, token)
}

func (f *ForgotPasswordHandler) Handler(context *gin.Context) error {
	var err error
	var user *models.User
	var tokenString string
	var request *validator.ForgotPasswordRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.Validate(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if user, err = f.GetRepository().GetUserByEmail(request.Email); err != nil {
		return err
	}

	if tokenString, err = auth.GenerateJWT(user, f.GetSharedFlags().JwtKeyEmail, time.Now().Add(constants.RESET_PASSWORD_TOKEN_EXPIRE_TIME)); err != nil {
		return err
	}

	url := GeneratePasswordResetUrl(f.GetSharedFlags(), f.GetFlags(), tokenString)
	if err := f.GetEmailClient().SendForgotPasswordURLToUserByEmail(user, url); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "url": url, "token": tokenString})
	return nil
}
