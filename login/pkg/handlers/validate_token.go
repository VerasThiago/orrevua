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
)

type ValidateUserTokenAPI interface {
	Handler(context *gin.Context) error
}

type ValidateUserTokenHandler struct {
	builder.Builder
}

func (c *ValidateUserTokenHandler) InitFromBuilder(builder builder.Builder) *ValidateUserTokenHandler {
	c.Builder = builder
	return c
}

func (c *ValidateUserTokenHandler) Handler(context *gin.Context) error {
	var err error
	var tokenString string
	var jwtClaim *auth.JWTClaim
	var request validator.ValidateTokenRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.Validate(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if err := auth.ValidateToken(request.Token, c.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if jwtClaim, err = auth.GetJWTClaimFromToken(request.Token, c.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if tokenString, err = auth.GenerateJWT(jwtClaim.User, c.GetSharedFlags().JwtKey, time.Now().Add(constants.APP_TOKEN_EXPIRE_TIME)); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "token": tokenString})
	return nil
}
