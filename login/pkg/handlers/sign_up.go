package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	error_handler "github.com/verasthiago/tickets-generator/shared/errors"
)

type CreateUserAPI interface {
	Handler(context *gin.Context)
}

type CreateUserHandler struct {
	builder.Builder
}

const VERIFY_EMAIL_TOKEN_EXPIRE_TIME = 1 * time.Hour

func (c *CreateUserHandler) InitFromBuilder(builder builder.Builder) *CreateUserHandler {
	c.Builder = builder
	return c
}

func GenerateVerifyEmailUrl(host string, token string) string {
	return fmt.Sprintf("%s/email/verify?token=%s", host, token)
}

func (c *CreateUserHandler) Handler(context *gin.Context) {
	var request validator.SignUpRequest
	var tokenString string
	var err error
	if err := context.ShouldBindJSON(&request); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if errors := request.Validate(); len(errors) > 0 {
		error_handler.HandleBadRequestErrors(context, errors)
		return
	}

	if err := request.HashPassword(request.Password); err != nil {
		error_handler.HandleInternalServerError(context, err, c.GetLog())
		return
	}

	if err := c.GetRepository().CreateUser(request.User); err != nil {
		error_handler.HandleInternalServerError(context, err, c.GetLog())
		return
	}

	if tokenString, err = auth.GenerateJWT(request.User, c.GetSharedFlags().JwtKeyEmail, time.Now().Add(VERIFY_EMAIL_TOKEN_EXPIRE_TIME)); err != nil {
		error_handler.HandleInternalServerError(context, err, c.GetLog())
		return
	}

	url := GenerateVerifyEmailUrl(c.GetSharedFlags().AppHost, tokenString)

	if err := c.GetEmailClient().SendVerifyEmailToUser(*request.User, url); err != nil {
		error_handler.HandleInternalServerError(context, err, c.GetLog())
		return
	}

	context.JSON(http.StatusCreated, gin.H{"email": request.Email, "username": request.Username, "url": url, "token": tokenString})
}
