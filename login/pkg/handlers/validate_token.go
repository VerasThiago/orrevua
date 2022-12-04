package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/constants"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	"github.com/verasthiago/tickets-generator/shared/auth"
	error_handler "github.com/verasthiago/tickets-generator/shared/errors"
)

type ValidateUserTokenAPI interface {
	Handler(context *gin.Context)
}

type ValidateUserTokenHandler struct {
	builder.Builder
}

func (c *ValidateUserTokenHandler) InitFromBuilder(builder builder.Builder) *ValidateUserTokenHandler {
	c.Builder = builder
	return c
}

func (c *ValidateUserTokenHandler) Handler(context *gin.Context) {
	var err error
	var tokenString string
	var jwtClaim *auth.JWTClaim
	var request validator.ValidateTokenRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if errors := request.Validate(); len(errors) > 0 {
		error_handler.HandleBadRequestErrors(context, errors)
		return
	}

	if err := auth.ValidateToken(request.Token, c.GetSharedFlags().JwtKey); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if jwtClaim, err = auth.GetJWTClaimFromToken(request.Token, c.GetSharedFlags().JwtKey); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()
		return
	}

	if tokenString, err = auth.GenerateJWT(jwtClaim.User, c.GetSharedFlags().JwtKey, time.Now().Add(constants.APP_TOKEN_EXPIRE_TIME)); err != nil {
		error_handler.HandleInternalServerError(context, err, c.GetLog())
		return
	}

	context.JSON(http.StatusOK, gin.H{"status": "success", "token": tokenString})
}
