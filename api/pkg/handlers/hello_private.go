package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
)

type HelloPrivateAPI interface {
	Handler(context *gin.Context)
}

type HelloPrivateHandler struct {
	builder.Builder
}

func (l *HelloPrivateHandler) InitFromBuilder(builder builder.Builder) *HelloPrivateHandler {
	l.Builder = builder
	return l
}
func (l *HelloPrivateHandler) Handler(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{"status": "success", "message": "hello private!"})
}
