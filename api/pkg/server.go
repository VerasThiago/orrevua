package pkg

import (
	"github.com/gin-gonic/gin"
	"github.com/verasthiago/tickets-generator/api/pkg/builder"
	"github.com/verasthiago/tickets-generator/api/pkg/handlers"
	"github.com/verasthiago/tickets-generator/api/pkg/handlers/invite"
	"github.com/verasthiago/tickets-generator/api/pkg/handlers/ticket"
	"github.com/verasthiago/tickets-generator/api/pkg/middlewares"
	"github.com/verasthiago/tickets-generator/shared/errors"
)

type Server struct {
	builder.Builder

	Hello          handlers.HelloAPI
	TicketList     ticket.TicketListAPI
	TicketCreate   ticket.TicketCreateAPI
	TicketDelete   ticket.TicketDeleteAPI
	TicketValidate ticket.TicketValidateAPI
	TicketSend     ticket.TicketSendAPI

	InviteSend invite.InviteSendAPI

	AuthAPI middlewares.AuthUserAPI
}

func (s *Server) InitFromBuilder(builder builder.Builder) *Server {
	s.Builder = builder
	s.Hello = new(handlers.HelloHandler).InitFromBuilder(builder)
	s.TicketList = new(ticket.TicketListHandler).InitFromBuilder(builder)
	s.TicketCreate = new(ticket.TicketCreateHandler).InitFromBuilder(builder)
	s.TicketDelete = new(ticket.TicketDeleteHandler).InitFromBuilder(builder)
	s.TicketValidate = new(ticket.TicketValidateHandler).InitFromBuilder(builder)
	s.TicketSend = new(ticket.TicketSendHandler).InitFromBuilder(builder)

	s.InviteSend = new(invite.InviteSendHandler).InitFromBuilder(builder)

	s.AuthAPI = new(middlewares.AuthUserHandler).InitFromFlags(builder.GetFlags(), builder.GetSharedFlags())
	return s
}

func (s *Server) Run() error {

	app := gin.Default()
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
				ticketV0.POST("/send", errors.ErrorRoute(s.TicketSend.Handler))
			}
			inviteVO := apiV0.Group("/invite")
			{
				inviteVO.POST("/send", errors.ErrorRoute(s.InviteSend.Handler))
			}

			apiV0.GET("hello", s.Hello.Handler)
		}
	}
	return app.Run(":" + s.GetFlags().Port)
}
