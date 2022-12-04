package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
	"github.com/verasthiago/tickets-generator/shared/errors"
)

type UpdateUserAPI interface {
	Handler(context *gin.Context) error
}

type UpdateUserHandler struct {
	builder.Builder
}

func (l *UpdateUserHandler) InitFromBuilder(builder builder.Builder) *UpdateUserHandler {
	l.Builder = builder
	return l
}

func (l *UpdateUserHandler) Handler(context *gin.Context) error {
	var request *validator.UpdateRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		return err
	}

	if errList := request.Validate(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if err := l.GetRepository().UpdateUser(request.User); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success"})
	return nil
}
