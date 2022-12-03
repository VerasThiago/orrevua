package handlers

import (
	"net/http"

	"github.com/verasthiago/tickets-generator/shared/auth"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	error_handler "github.com/verasthiago/tickets-generator/shared/errors"
)

type VerifyEmailAPI interface {
	Handler(context *gin.Context)
}

type VerifyEmailHandler struct {
	builder.Builder
}

func (c *VerifyEmailHandler) InitFromBuilder(builder builder.Builder) *VerifyEmailHandler {
	c.Builder = builder
	return c
}

func (c *VerifyEmailHandler) Handler(context *gin.Context) {
	tokenString := context.GetHeader("Authorization")

	jwt, err := auth.GetJWTClaimFromToken(tokenString, c.GetSharedFlags().JwtKeyEmail)
	if err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if err := c.GetRepository().VerifyUserAccountByID(jwt.User.ID); err != nil {
		error_handler.HandleInternalServerError(context, err, c.GetLog())
		return
	}

	context.JSON(http.StatusOK, gin.H{"status": "succes"})
}
