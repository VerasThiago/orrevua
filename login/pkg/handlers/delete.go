package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	error_handler "github.com/verasthiago/tickets-generator/shared/errors"
)

type DeleteUserAPI interface {
	Handler(context *gin.Context)
}

type DeleteUserHandler struct {
	builder.Builder
}

func (l *DeleteUserHandler) InitFromBuilder(builder builder.Builder) *DeleteUserHandler {
	l.Builder = builder
	return l
}

func (l *DeleteUserHandler) Handler(context *gin.Context) {
	var request validator.DeleteRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if errors := request.Validate(); len(errors) > 0 {
		error_handler.HandleBadRequestErrors(context, errors)
		return
	}

	if err := l.GetRepository().DeleteUser(request.UserID); err != nil {
		error_handler.HandleInternalServerError(context, err, l.GetLog())
	}

	context.JSON(http.StatusOK, gin.H{"status": "success"})
}
