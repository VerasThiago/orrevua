package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/constants"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/flags"
)

type CreateUserAPI interface {
	Handler(context *gin.Context) error
}

type CreateUserHandler struct {
	builder.Builder
}

func (c *CreateUserHandler) InitFromBuilder(builder builder.Builder) *CreateUserHandler {
	c.Builder = builder
	return c
}

func GenerateVerifyEmailUrl(sharedFlags *flags.SharedFlags, apiFlags *builder.Flags, token string) string {
	if sharedFlags.Deploy == flags.DEPLOY_LOCAL {
		return fmt.Sprintf("%s:%s/email/verify?token=%s", sharedFlags.AppHost, apiFlags.WebPort, token)
	}
	return fmt.Sprintf("%s/email/verify?token=%s", sharedFlags.AppHost, token)
}

func (c *CreateUserHandler) Handler(context *gin.Context) error {
	var request validator.SignUpRequest
	var tokenString string
	var err error

	if err := context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.Validate(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if err := request.HashPassword(request.Password); err != nil {
		return err
	}

	if err := c.GetRepository().CreateUser(request.User); err != nil {
		return err
	}

	if tokenString, err = auth.GenerateJWT(request.User, c.GetSharedFlags().JwtKeyEmail, time.Now().Add(constants.VERIFY_EMAIL_TOKEN_EXPIRE_TIME)); err != nil {
		return err
	}

	url := GenerateVerifyEmailUrl(c.GetSharedFlags(), c.GetFlags(), tokenString)
	if err := c.GetEmailClient().SendVerifyEmailToUser(request.User, url); err != nil {
		return err
	}

	context.JSON(http.StatusCreated, gin.H{"email": request.Email, "username": request.Username, "url": url, "token": tokenString})
	return nil
}
