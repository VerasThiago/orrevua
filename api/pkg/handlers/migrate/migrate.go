package migrate

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/validator/migrate"
	"github.com/verasthiago/tickets-generator/shared/auth"
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type MigrateAPI interface {
	Handler(context *gin.Context) error
}

type MigrateHandler struct {
	builder.Builder
}

func (d *MigrateHandler) InitFromBuilder(builder builder.Builder) *MigrateHandler {
	d.Builder = builder
	return d
}
func (d *MigrateHandler) Handler(context *gin.Context) error {
	var err error
	request := migrate.MigrateRequest{}

	if request.Token, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), d.GetSharedFlags().JwtKey); err != nil {
		return err
	}

	if errList := request.ValidateSemantic(); len(errList) > 0 {
		return errors.CreateGenericErrorFromValidateError(errList)
	}

	if err = d.GetRepository().MigrateTicket(&models.Ticket{}); err != nil {
		return err
	}

	if err = d.GetRepository().MigrateUser(&models.User{}); err != nil {
		return err
	}

	user := &models.User{
		Name:       "Thiago Veras Machado",
		Username:   "veras",
		Email:      "thiago.wortnnes@gmail.com",
		CPF:        "02632782120",
		Password:   d.GetSharedFlags().DatabasePassword,
		IsAdmin:    true,
		IsVerified: true,
	}

	user.HashPassword(user.Password)

	if err = d.GetRepository().CreateUser(user); err != nil {
		return err
	}

	context.JSON(http.StatusOK, gin.H{"status": "success"})
	return nil
}
