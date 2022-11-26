package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/shared/auth"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
)

type AuthUserAPI interface {
	Handler() gin.HandlerFunc
}

type AuthUserHandler struct {
	*builder.Flags
	*shared.SharedFlags
}

func (a *AuthUserHandler) InitFromFlags(flags *builder.Flags, sharedFlags *shared.SharedFlags) *AuthUserHandler {
	a.Flags = flags
	a.SharedFlags = sharedFlags

	return a
}

func (a *AuthUserHandler) Handler() gin.HandlerFunc {
	return func(context *gin.Context) {
		var jwtClaim *auth.JWTClaim
		tokenString := context.GetHeader("Authorization")
		if tokenString == "" {
			context.JSON(401, gin.H{"error": "request does not contain an access token"})
			context.Abort()
			return
		}
		err := auth.ValidateToken(tokenString, a.JwtKey)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()
			return
		}

		if jwtClaim, err = auth.GetJWTClaimFromToken(context.GetHeader("Authorization"), a.JwtKey); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			context.Abort()
			return
		}

		if !jwtClaim.IsAdmin {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user isn't admin"})
			context.Abort()
			return
		}

		context.Next()
	}
}
