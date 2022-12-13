package errors

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgconn"
	"github.com/verasthiago/tickets-generator/shared/models"
	"gorm.io/gorm"
)

type StatusCode int

const (
	STATUS_BAD_REQUEST           = http.StatusBadRequest
	STATUS_INTERNAL_SERVER_ERROR = http.StatusInternalServerError
	STATUS_UNAUTHORIZED          = http.StatusUnauthorized
	STATUS_NOT_FOUND             = http.StatusNotFound

	PSQL_DUPLICATED_KEY_ERROR_CODE = "23505"
)

func ErrorRoute(route models.Route) func(c *gin.Context) {
	return func(c *gin.Context) {
		if err := route(c); err != nil {
			recoveryHandler(c, err)
		}
	}
}

func recoveryHandler(c *gin.Context, errorData interface{}) {
	if jsonErr, ok := errorData.(JsonError); ok {
		jsonErr.GenerateJsonResponse(c)
	} else if err, ok := errorData.(error); ok {
		jsonErr := GenericError{
			Code:    STATUS_INTERNAL_SERVER_ERROR,
			Err:     err,
			Message: "There was an error regenerating. We've been notified and will look into it!",
		}
		jsonErr.GenerateJsonResponse(c)
	} else if strErr, ok := errorData.(string); ok {
		jsonErr := GenericError{
			Code:    STATUS_INTERNAL_SERVER_ERROR,
			Message: strErr,
		}
		jsonErr.GenerateJsonResponse(c)
	}
}

func CreateGenericErrorFromValidateError(errors []string) GenericError {
	return GenericError{
		Code:    STATUS_BAD_REQUEST,
		Message: strings.Join(errors, "\n"),
	}
}

func IsNotFoundError(err error) bool {
	return err == gorm.ErrRecordNotFound
}

func IsDuplicatedKeyError(err error) bool {
	var perr *pgconn.PgError
	if errors.As(err, &perr) {
		return perr.Code == PSQL_DUPLICATED_KEY_ERROR_CODE
	}
	return false
}

func HandleDuplicateError(err error) error {
	if err == nil {
		return err
	}

	if IsDuplicatedKeyError(err) {
		return GenericError{
			Code:    STATUS_BAD_REQUEST,
			Err:     err,
			Message: "Data is already being used",
		}
	}

	return err
}

func HandleDataNotFoundError(err error, dataName string) error {
	if err == nil {
		return err
	}

	if IsNotFoundError(err) {
		return GenericError{
			Code:    STATUS_NOT_FOUND,
			Err:     err,
			Message: fmt.Sprintf("%+v not found", dataName),
		}
	}

	return err
}
