package errors

import (
	"fmt"
	"strconv"

	"github.com/bugsnag/bugsnag-go"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

type JsonError interface {
	Error() string
	GenerateJsonResponse(c *gin.Context)
}

type MetaData map[string]interface{}

type GenericError struct {
	Code     StatusCode
	Err      error `json:"-"`
	Message  string
	MetaData MetaData `json:"-"`
}

func (e GenericError) Error() string {
	return fmt.Sprintf("Code:%v\nOriginal error:%v\nMetaData:%v\nMessage:%v",
		e.Code, e.Err, e.MetaData, e.Message)
}

func (e GenericError) GenerateJsonResponse(c *gin.Context) {
	// if Err was provided log it
	if e.Err != nil {
		if e.MetaData == nil {
			e.MetaData = MetaData{}
		}
		// add useful metadata
		e.MetaData["url"] = c.FullPath()
		e.MetaData["query"] = c.Request.URL.Query()
		e.MetaData["post"] = c.Request.PostForm

		// get saved user id
		userId := c.GetInt64("user_id")
		e.MetaData["user_id"] = userId

		if userId > 0 {
			_ = bugsnag.Notify(e.Err, bugsnag.MetaData{
				"data": e.MetaData,
			}, bugsnag.User{
				Id: strconv.FormatInt(userId, 10),
			})
		} else {
			_ = bugsnag.Notify(e.Err, bugsnag.MetaData{
				"data": e.MetaData,
			})
		}

		log.Error(e.Err)
		log.Error(e.MetaData)
	}

	log.Errorf("Response %v: %v", e.Code, e.Message)
	c.AbortWithStatusJSON(int(e.Code), gin.H{"status": "failed", "message": e.Message})
}
