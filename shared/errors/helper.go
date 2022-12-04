package errors

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type StatusCode int

const (
	STATUS_BAD_REQUEST           = http.StatusBadRequest
	STATUS_INTERNAL_SERVER_ERROR = http.StatusInternalServerError
	STATUS_UNAUTHORIZED          = http.StatusUnauthorized
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
			Message: "There was an error regenerating.  We've been notified and will look into it!",
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
