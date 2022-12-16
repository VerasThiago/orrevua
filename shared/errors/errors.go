package errors

import (
	"fmt"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

type JsonError interface {
	Error() string
	GenerateJsonResponse(c *gin.Context)
}

type GenericError struct {
	Code     StatusCode
	Type     string
	Err      error `json:"-"`
	Message  string
	MetaData interface{} `json:"-"`
}

func (e GenericError) Error() string {
	return fmt.Sprintf("Code:%v\nOriginal error:%v\nMetaData:%v\nMessage:%v",
		e.Code, e.Err, e.MetaData, e.Message)
}

func (e GenericError) GenerateJsonResponse(c *gin.Context) {
	log.Errorf("Error\n")
	log.Errorf("\tCode: %v\n", e.Code)
	log.Errorf("\tErr: %v\n", e.Err)
	log.Errorf("\tMessge: %v\n", e.Message)
	log.Errorf("\tMetaData: %v\n", e.MetaData)

	c.AbortWithStatusJSON(int(e.Code), gin.H{"status": "failed", "error": gin.H{
		"type":     e.Type,
		"message":  e.Message,
		"metaData": e.MetaData,
	}})
}
