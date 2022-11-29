package email

import (
	"fmt"
	"net/smtp"

	shared "github.com/verasthiago/tickets-generator/shared/flags"
	"github.com/verasthiago/tickets-generator/shared/models"
)

type SMTPClient interface {
}

type SMTP struct {
	srcEmail string
	host     string
	port     string
	auth     smtp.Auth
}

func (r *SMTP) sendEmail(email models.Email) error {
	mime := "MIME-version: 1.0;\nContent-Type: text/plain; charset=\"UTF-8\";\n\n"
	subject := "Subject: " + email.Title + "!\n"
	msg := []byte(subject + mime + "\n" + email.Body)
	addr := fmt.Sprintf("%+v:%+v", r.host, r.port)

	return smtp.SendMail(addr, r.auth, r.srcEmail, []string{email.To}, msg)
}

func (r *SMTP) InitFromFlags(sharedFlags *shared.SharedFlags) SMTPClient {
	return &SMTP{
		srcEmail: sharedFlags.SMTPEmailLogin,
		host:     sharedFlags.SMTPEmailHost,
		port:     sharedFlags.SMTPEmailPort,
		auth:     smtp.PlainAuth(sharedFlags.SMTPEmailIdentity, sharedFlags.SMTPEmailLogin, sharedFlags.SMTPEmailPassword, sharedFlags.SMTPEmailHost),
	}
}
