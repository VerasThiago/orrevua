package pkg

import (
	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/handlers/ticket"
	"github.com/verasthiago/tickets-generator/api/pkg/middlewares"
	"github.com/verasthiago/tickets-generator/shared/errors"
	shared_middlewares "github.com/verasthiago/tickets-generator/shared/middlewares"
)

type Server struct {
	builder.Builder

	TicketList     ticket.TicketListAPI
	TicketCreate   ticket.TicketCreateAPI
	TicketDelete   ticket.TicketDeleteAPI
	TicketValidate ticket.TicketValidateAPI

	AuthAPI middlewares.AuthUserAPI
	CorsAPI shared_middlewares.CORSAPI
}

func (s *Server) InitFromBuilder(builder builder.Builder) *Server {
	s.Builder = builder
	s.TicketList = new(ticket.TicketListHandler).InitFromBuilder(builder)
	s.TicketCreate = new(ticket.TicketCreateHandler).InitFromBuilder(builder)
	s.TicketDelete = new(ticket.TicketDeleteHandler).InitFromBuilder(builder)
	s.TicketValidate = new(ticket.TicketValidateHandler).InitFromBuilder(builder)

	s.AuthAPI = new(middlewares.AuthUserHandler).InitFromFlags(builder.GetFlags(), builder.GetSharedFlags())
	s.CorsAPI = new(shared_middlewares.CORSHandler).InitFromFlags()

	return s
}

func (s *Server) Run() error {

	app := gin.Default()
	app.Use(s.CorsAPI.Handler())
	app.Use(s.AuthAPI.Handler())

	api := app.Group("/api")
	{
		apiV0 := api.Group("/v0")
		{
			ticketV0 := apiV0.Group("/ticket")
			{
				ticketV0.GET("/list/:userid", errors.ErrorRoute(s.TicketList.Handler))
				ticketV0.POST("/create", errors.ErrorRoute(s.TicketCreate.Handler))
				ticketV0.DELETE("/delete", errors.ErrorRoute(s.TicketDelete.Handler))
				ticketV0.POST("/validate", errors.ErrorRoute(s.TicketValidate.Handler))
			}
		}
	}
	return app.Run(":" + s.GetFlags().Port)
}
