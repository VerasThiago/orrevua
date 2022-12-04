package handlers

import (
	"net/http"

	"github.com/verasthiago/tickets-generator/shared/auth"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	error_handler "github.com/verasthiago/tickets-generator/shared/errors"
)

type UpdatePasswordAPI interface {
	Handler(context *gin.Context)
}

type UpdatePasswordHandler struct {
	builder.Builder
}

func (r *UpdatePasswordHandler) InitFromBuilder(builder builder.Builder) *UpdatePasswordHandler {
	r.Builder = builder
	return r
}

func (r *UpdatePasswordHandler) Handler(context *gin.Context) {
	var request validator.UpdatePasswordRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if errors := request.Validate(); len(errors) > 0 {
		error_handler.HandleBadRequestErrors(context, errors)
		return
	}

	tokenString := context.GetHeader("Authorization")

	jwt, err := auth.GetJWTClaimFromToken(tokenString, r.GetSharedFlags().JwtKeyEmail)
	if err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if err := r.GetRepository().UpdateUserPasswordByEmail(jwt.User.Email, request.Password); err != nil {
		error_handler.HandleInternalServerError(context, err, r.GetLog())
		return
	}

	context.JSON(http.StatusOK, gin.H{"status": "success"})

}
