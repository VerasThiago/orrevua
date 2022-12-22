package errors

import (
	"errors"
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

var (
	ERROR_KEY_MAP = map[string]string{
		"users_email_key":   "email",
		"users_cpf_key":     "cpf",
		"tickets_cpf_key":   "cpf",
		"tickets_email_key": "email",
	}
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
			Type:    GENERIC_ERROR.Type,
			Message: GENERIC_ERROR.Message,
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
		Type:    INVALID_INPUT.Type,
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

func BuildI18NPath(key, value string) string {
	return strings.Join([]string{key, value}, ".")
}

func HandleDuplicateError(err error) error {
	if err == nil {
		return err
	}

	if IsDuplicatedKeyError(err) {
		var ok bool
		var duplicatedData string

		// Assuming that always the message will be 'Something... "key" (SQLSTATE 23505)'
		// This will break into ["Something...", "key", "(SQLSTATE 23505)"]
		duplicatedDataDB := strings.Split(err.Error(), "\"")[1]
		if duplicatedData, ok = ERROR_KEY_MAP[duplicatedDataDB]; !ok {
			duplicatedData = "UNDEFINED"
		}

		return GenericError{
			Code:    STATUS_BAD_REQUEST,
			Err:     err,
			Type:    DATA_ALREADY_BEGIN_USED.Type,
			Message: DATA_ALREADY_BEGIN_USED.Message,
			MetaData: map[string]interface{}{
				"variables": []map[string]interface{}{
					{
						"path": BuildI18NPath(I18N_FIELDS, duplicatedData),
					},
				},
			},
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
			Type:    DATA_NOT_FOUND.Type,
			Message: DATA_NOT_FOUND.Message,
			MetaData: map[string]interface{}{
				"variables": []map[string]interface{}{
					{
						"path": BuildI18NPath(I18N_MODELS, dataName),
					},
				},
			},
		}
	}

	return err
}
