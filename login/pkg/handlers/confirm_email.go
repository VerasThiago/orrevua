package handlers

import (
	"net/http"

	"github.com/verasthiago/tickets-generator/shared/auth"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	error_handler "github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type ConfirmEmailAPI interface {
	Handler(context *gin.Context)
}

type ConfirmEmailHandler struct {
	builder.Builder
}

func (c *ConfirmEmailHandler) InitFromBuilder(builder builder.Builder) *ConfirmEmailHandler {
	c.Builder = builder
	return c
}

func ConfirmUserEmail(user *models.User) *models.User {
	user.Confirmed = true
	return user
}

func (c *ConfirmEmailHandler) Handler(context *gin.Context) {
	tokenString := context.GetHeader("Authorization")

	user, err := auth.GetJWTClaimFromToken(tokenString, c.GetSharedFlags().JwtKeyEmail)
	if err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if err := c.GetRepository().UpdateConfirmedStatusByEmail(user.Email); err != nil {
		error_handler.HandleInternalServerError(context, err, c.GetLog())
		return
	}

	context.JSON(http.StatusOK, gin.H{"status": "succes"})
}
