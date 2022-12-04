package pkg

import (
	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/login/pkg/builder"
	"github.com/verasthiago/tickets-generator/login/pkg/handlers"
	"github.com/verasthiago/tickets-generator/login/pkg/middlewares"
	"github.com/verasthiago/tickets-generator/shared/errors"
)

type Server struct {
	builder.Builder

	LoginAPI             handlers.LoginUserAPI
	CreateAPI            handlers.CreateUserAPI
	DeleteAPI            handlers.DeleteUserAPI
	UpdateAPI            handlers.UpdateUserAPI
	ForgotPasswordAPI    handlers.ForgotPasswordAPI
	UpdatePasswordAPI    handlers.UpdatePasswordAPI
	AuthResetPasswordAPI middlewares.AuthResetPasswordAPI
	VerifyEmailAPI       handlers.VerifyEmailAPI
	ValidateTokenAPI     handlers.ValidateUserTokenAPI

	AdminAPI middlewares.AuthUserAPI
}

func (s *Server) InitFromBuilder(builder builder.Builder) *Server {
	s.Builder = builder
	s.LoginAPI = new(handlers.LoginUserHandler).InitFromBuilder(builder)
	s.CreateAPI = new(handlers.CreateUserHandler).InitFromBuilder(builder)
	s.DeleteAPI = new(handlers.DeleteUserHandler).InitFromBuilder(builder)
	s.UpdateAPI = new(handlers.UpdateUserHandler).InitFromBuilder(builder)
	s.ForgotPasswordAPI = new(handlers.ForgotPasswordHandler).InitFromBuilder(builder)
	s.UpdatePasswordAPI = new(handlers.UpdatePasswordHandler).InitFromBuilder(builder)
	s.VerifyEmailAPI = new(handlers.VerifyEmailHandler).InitFromBuilder(builder)
	s.ValidateTokenAPI = new(handlers.ValidateUserTokenHandler).InitFromBuilder(builder)

	s.AuthResetPasswordAPI = new(middlewares.AuthResetPasswordHandler).InitFromFlags(builder.GetFlags(), builder.GetSharedFlags())
	s.AdminAPI = new(middlewares.AuthUserHandler).InitFromFlags(builder.GetFlags(), builder.GetSharedFlags())
	return s
}

func (s *Server) Run() error {

	app := gin.Default()
	api := app.Group("/login")
	{
		apiV0 := api.Group("/v0")
		{

			apiV0User := apiV0.Group("/user")
			{
				apiV0User.POST("signin", errors.ErrorRoute(s.LoginAPI.Handler))
				apiV0User.POST("signup", errors.ErrorRoute(s.CreateAPI.Handler))
				apiV0UserPassword := apiV0User.Group("/password")
				{
					apiV0UserPassword.POST("forget", errors.ErrorRoute(s.ForgotPasswordAPI.Handler))
					apiV0UserPassword.Use(s.AuthResetPasswordAPI.Handler()).PATCH("update", errors.ErrorRoute(s.UpdatePasswordAPI.Handler))
				}
				apiV0UserEmail := apiV0User.Group("/email")
				{
					apiV0UserEmail.PATCH("verify", errors.ErrorRoute(s.VerifyEmailAPI.Handler))
				}
				apiV0Token := apiV0User.Group("/token")
				{
					apiV0Token.POST("validate", errors.ErrorRoute(s.ValidateTokenAPI.Handler))
				}
			}
			apiV0Admin := apiV0.Group("/admin").Use(s.AdminAPI.Handler())
			{
				apiV0Admin.DELETE("delete", errors.ErrorRoute(s.DeleteAPI.Handler))
				apiV0Admin.PUT("update", errors.ErrorRoute(s.UpdateAPI.Handler))
			}
		}
	}
	return app.Run(":" + s.GetFlags().Port)
}
