package email

import (
	"net/smtp"

	qrcode "github.com/skip2/go-qrcode"
	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type SMTPClient interface {
	SendInviteToUser(user models.User) error
	SendQRCodeToUser(user models.User) error
}

type SMTP struct {
	srcEmail string
	host     string
	port     string
	auth     smtp.Auth
}

type TemplateData struct {
	Name  string
	Title string
}

func (s *SMTP) SendInviteToUser(user models.User) error {
	templateData := TemplateData{
		Name:  user.Name,
		Title: INVITE_TITLE,
	}

	body, err := parseTemplate(templateData)
	if err != nil {
		return err
	}

	return s.sendHtmlEmail(models.Email{
		To:    user.Email,
		Title: templateData.Title,
		Body:  *body,
	})
}

func (s *SMTP) SendQRCodeToUser(user models.User) error {
	// TODO: Get all user tickets (use tickets model that will be implemented soon)
	var tickets []models.User = []models.User{user}
	var attachments map[string][]byte = make(map[string][]byte)

	for _, ticket := range tickets {
		qrcode, err := qrcode.Encode(user.ID, qrcode.Medium, 256)
		if err != nil {
			return err
		}
		attachments[addFileExtention(ticket.Name, PNG_EXTENTION)] = qrcode
	}

	return s.sendEmailWithAttachments(models.Email{
		To:          user.Email,
		Title:       TICKETS_TILE,
		Body:        TICKETS_BODY,
		Attachments: attachments,
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
