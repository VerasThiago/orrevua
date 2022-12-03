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
	SendForgotPasswordURLToUser(user models.User, token string) error
	SendConfirmEmailToUser(user models.User, token string) error
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

type ResetPasswordTemplateData struct {
	Email string
	Title string
	Token string
}

type ConfirmEmailTemplateData struct {
	Email string
	Title string
	Token string
}

func (s *SMTP) SendInviteToUser(user models.User) error {
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

func (s *SMTP) SendForgotPasswordURLToUser(user models.User, token string) error {

	resetPasswordTemplateData := ResetPasswordTemplateData{
		Email: user.Email,
		Title: RESET_PASSOWRD_TITLE,
		Token: token,
	}

	body, err := parseTemplate(resetPasswordTemplateData, RESET_PASSWORD_TEMPLATE_PATH)
	if err != nil {
		return err
	}

	return s.sendHtmlEmail(models.Email{
		To:    user.Email,
		Title: resetPasswordTemplateData.Title,
		Body:  *body,
	})
}

func (s *SMTP) SendConfirmEmailToUser(user models.User, token string) error {
	confirmEmailTemplateData := ConfirmEmailTemplateData{
		Email: user.Email,
		Title: CONFIRM_EMAIL_TITLE,
		Token: token,
	}

	body, err := parseTemplate(confirmEmailTemplateData, CONFIRM_EMAIL_TEMPLATE_PATH)
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
