package email

import (
	"net/smtp"

	qrcode "github.com/skip2/go-qrcode"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type SMTPClient interface {
	SendInviteToUser(user *models.User) error
	SendTicketsToUser(user *models.User, tickets []*models.Ticket) error
	SendForgotPasswordURLToUserByEmail(user *models.User, token string) error
	SendVerifyEmailToUser(user *models.User, token string) error
}

type SMTP struct {
	srcEmail string
	host     string
	port     string
	auth     smtp.Auth
}

type InviteTemplateData struct {
	Name  string
	Title string
}

type ForgotPasswordTemplateData struct {
	Email string
	Title string
	Url   string
}

type VerifyEmailTemplateData struct {
	Email string
	Title string
	Url   string
}

func (s *SMTP) SendInviteToUser(user *models.User) error {
	inviteTemplateData := InviteTemplateData{
		Name:  user.Name,
		Title: INVITE_TITLE,
	}

	body, err := parseTemplate(inviteTemplateData, QR_CODE_TEMPLATE_PATH)
	if err != nil {
		return err
	}

	return s.sendHtmlEmail(models.Email{
		To:    user.Email,
		Title: inviteTemplateData.Title,
		Body:  *body,
	})
}

func (s *SMTP) SendTicketsToUser(user *models.User, tickets []*models.Ticket) error {
	var err error
	var qrCode []byte
	var attachments map[string][]byte = make(map[string][]byte)

	for _, ticket := range tickets {
		fileName := addFileExtention(ticket.Name, PNG_EXTENTION)

		if qrCode, err = qrcode.Encode(ticket.CPF, qrcode.Medium, 256); err != nil {
			return err
		}

		if ticket.CPF != user.CPF {
			go s.sendEmailWithAttachments(models.Email{
				To:          ticket.Email,
				Title:       TICKETS_TILE,
				Body:        TICKETS_BODY,
				Attachments: map[string][]byte{fileName: qrCode},
			})
		}

		attachments[fileName] = qrCode
	}

	return s.sendEmailWithAttachments(models.Email{
		To:          user.Email,
		Title:       TICKETS_TILE,
		Body:        TICKETS_BODY,
		Attachments: attachments,
	})
}

func (s *SMTP) SendForgotPasswordURLToUserByEmail(user *models.User, url string) error {
	forgotPasswordTemplateData := ForgotPasswordTemplateData{
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
