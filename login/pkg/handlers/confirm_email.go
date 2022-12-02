package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/validator"
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
	var request *validator.ConfirmEmailRequest
	var user *models.User
	var err error

	if err := context.ShouldBindJSON(&request); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	if errors := request.Validate(); len(errors) > 0 {
		error_handler.HandleBadRequestErrors(context, errors)
		return
	}

	if user, err = c.GetRepository().GetUserByID(request.ID); err != nil {
		error_handler.HandleInternalServerError(context, err, c.GetLog())
		return
	}

	ConfirmUserEmail(user)

	if err := c.GetRepository().UpdateUser(user); err != nil {
		error_handler.HandleBadRequestError(context, err)
		return
	}

	context.JSON(http.StatusOK, gin.H{"status": "succes"})
}
