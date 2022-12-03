package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/shared/auth"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
)

type AuthResetPasswordAPI interface {
	Handler() gin.HandlerFunc
}

type AuthResetPasswordHandler struct {
	*builder.Flags
	*shared.SharedFlags
}

func (a *AuthResetPasswordHandler) InitFromFlags(flags *builder.Flags, sharedFlags *shared.SharedFlags) *AuthResetPasswordHandler {
	a.Flags = flags
	a.SharedFlags = sharedFlags

	return a
}

func (a *AuthResetPasswordHandler) Handler() gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if tokenString == "" {
			context.JSON(401, gin.H{"error": "request does not contain an access token"})
			context.Abort()
			return
		}
		err := auth.ValidateToken(tokenString, a.JwtKeyEmail)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()
			return
		}
		context.Next()
	}
}
