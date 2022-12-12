package email

import (
	"net/smtp"

	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type SMTPClient interface {
	SendNewTicketToUser(user *models.User, ticket *models.Ticket, url string) error
	SendForgotPasswordURLToUserByEmail(user *models.User, token string) error
	SendVerifyEmailToUser(user *models.User, token string) error
}

type SMTP struct {
	srcEmail string
	host     string
	port     string
	auth     smtp.Auth
}

type NewTicketTemplateData struct {
	Title          string
	Name           string
	TicketUserName string
	Url            string
}

type ForgotPasswordTemplateData struct {
	Name  string
	Email string
	Title string
	Url   string
}

type VerifyEmailTemplateData struct {
	Email string
	Title string
	Url   string
	Name  string
}

func (s *SMTP) SendNewTicketToUser(user *models.User, ticket *models.Ticket, url string) error {
	newTicketTemplateData := NewTicketTemplateData{
		Title:          TICKET_TILE,
		Name:           user.Name,
		TicketUserName: ticket.Name,
		Url:            url,
	}

	body, err := parseTemplate(newTicketTemplateData, NEW_TICKET_TEMPLATE_PATH)
	if err != nil {
		return err
	}

	return s.sendHtmlEmail(models.Email{
		To:    user.Email,
		Title: newTicketTemplateData.Title,
		Body:  *body,
	})
}

func (s *SMTP) SendForgotPasswordURLToUserByEmail(user *models.User, url string) error {
	forgotPasswordTemplateData := ForgotPasswordTemplateData{
		Name:  user.Name,
		Email: user.Email,
		Title: RESET_PASSOWRD_TITLE,
		Url:   url,
	}

	body, err := parseTemplate(forgotPasswordTemplateData, RESET_PASSWORD_TEMPLATE_PATH)
	if err != nil {
		return err
	}

	return s.sendHtmlEmail(models.Email{
		To:    user.Email,
		Title: forgotPasswordTemplateData.Title,
		Body:  *body,
	})
}

func (s *SMTP) SendVerifyEmailToUser(user *models.User, url string) error {
	confirmEmailTemplateData := VerifyEmailTemplateData{
		Email: user.Email,
		Title: VERIFY_EMAIL_TITLE,
		Url:   url,
		Name:  user.Name,
	}

	body, err := parseTemplate(confirmEmailTemplateData, VERIFY_EMAIL_TEMPLATE_PATH)
	if err != nil {
		return err
	}

	return s.sendHtmlEmail(models.Email{
		To:    user.Email,
		Title: confirmEmailTemplateData.Title,
		Body:  *body,
	})
}

func (s *SMTP) InitFromFlags(sharedFlags *shared.SharedFlags) SMTPClient {
	return &SMTP{
		srcEmail: sharedFlags.SMTPEmailLogin,
		host:     sharedFlags.SMTPEmailHost,
		port:     sharedFlags.SMTPEmailPort,
		auth:     smtp.PlainAuth(sharedFlags.SMTPEmailIdentity, sharedFlags.SMTPEmailLogin, sharedFlags.SMTPEmailPassword, sharedFlags.SMTPEmailHost),
	}
}
