package error

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func HandleInternalServerError(context *gin.Context, err error, log *zap.Logger) {
	if err == gorm.ErrRecordNotFound {
		context.JSON(http.StatusNotFound, gin.H{"error": "object not found on database"})
	} else {
		log.Sugar().Errorw(err.Error())
		context.JSON(http.StatusInternalServerError, gin.H{"error": "unexpected behavior"})
	}
	context.Abort()
}

func HandleBadRequestError(context *gin.Context, err error) {
	context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	context.Abort()
}

func HandleBadRequestErrors(context *gin.Context, errors []string) {
	context.JSON(http.StatusBadRequest, gin.H{"error": errors})
	context.Abort()
}
