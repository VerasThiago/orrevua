package handlers

import (
	"net/http"

	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
)

type UpdatePasswordAPI interface {
	Handler(context *gin.Context) error
}

type UpdatePasswordHandler struct {
	builder.Builder
}

func (r *UpdatePasswordHandler) InitFromBuilder(builder builder.Builder) *UpdatePasswordHandler {
	r.Builder = builder
	return r
}

func (r *UpdatePasswordHandler) Handler(context *gin.Context) error {
	var err error
	var tokenString string
	var jwt *auth.JWTClaim
	var request validator.UpdatePasswordRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.Validate(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	tokenString = context.GetHeader("Authorization")

	if jwt, err = auth.GetJWTClaimFromToken(tokenString, r.GetSharedFlags().JwtKeyEmail); err != nil {
		return err
	}

	if err := r.GetRepository().UpdateUserPasswordByEmail(jwt.User.Email, request.Password); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success"})
	return nil
}
