package models

import "github.com/gin-gonic/gin"

type Route func(*gin.Context) error
