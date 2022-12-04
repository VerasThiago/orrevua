package handlers

import (
	"net/http"

	"github.com/verasthiago/tickets-generator/shared/auth"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
)

type VerifyEmailAPI interface {
	Handler(context *gin.Context) error
}

type VerifyEmailHandler struct {
	builder.Builder
}

func (c *VerifyEmailHandler) InitFromBuilder(builder builder.Builder) *VerifyEmailHandler {
	c.Builder = builder
	return c
}

func (c *VerifyEmailHandler) Handler(context *gin.Context) error {
	var err error
	var tokenString string
	var jwt *auth.JWTClaim

	tokenString = context.GetHeader("Authorization")
	if jwt, err = auth.GetJWTClaimFromToken(tokenString, c.GetSharedFlags().JwtKeyEmail); err != nil {
		return err
	}

	if err := c.GetRepository().VerifyUserAccountByID(jwt.User.ID); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success"})
	return nil
}
