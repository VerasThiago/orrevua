package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	error_handler "github.com/verasthiago/tickets-generator/shared/errors"
)

type UpdateUserAPI interface {
	Handler(context *gin.Context)
}

type UpdateUserHandler struct {
	builder.Builder
}

func (l *UpdateUserHandler) InitFromBuilder(builder builder.Builder) *UpdateUserHandler {
	l.Builder = builder
	return l
}

func (l *UpdateUserHandler) Handler(context *gin.Context) {
	var request *validator.UpdateRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if errors := request.Validate(); len(errors) > 0 {
		error_handler.HandleBadRequestErrors(context, errors)
		return
	}

	if err := l.GetRepository().UpdateUser(request.User); err != nil {
		error_handler.HandleInternalServerError(context, err, l.GetLog())
		return
	}

	context.JSON(http.StatusOK, gin.H{"status": "success"})
}
