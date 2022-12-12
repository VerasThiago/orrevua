package email

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"mime/multipart"
	"net/http"
	"net/smtp"
	"strings"
	"text/template"

	"github.com/verasthiago/tickets-generator/shared/models"
)

const (
	VERIFY_EMAIL_TEMPLATE_PATH   = "../shared/templates/verify_email.html"
	NEW_TICKET_TEMPLATE_PATH     = "../shared/templates/new_ticket.html"
	RESET_PASSWORD_TEMPLATE_PATH = "../shared/templates/forgot_password.html"
	INVITE_TITLE                 = "Despedida Veras - Convite"
	TICKET_TILE                  = "Despedida Veras - Ingresso"
	RESET_PASSOWRD_TITLE         = "Despedida Veras - Esqueci minha senha"
	VERIFY_EMAIL_TITLE           = "Despedida Veras - Confirme seu email"
	TICKETS_BODY                 = "Aqui está seus ingressos, tenha uma boa festa!"
	PNG_EXTENTION                = "png"
)

func (s *SMTP) generateAttachmentsBody(email models.Email) []byte {

	buf := bytes.NewBuffer(nil)
	withAttachments := len(email.Attachments) > 0
	buf.WriteString(fmt.Sprintf("Subject: %s\n", email.Title))
	buf.WriteString(fmt.Sprintf("To: %s\n", []string{email.To}))
	buf.WriteString("MIME-Version: 1.0\n")
	writer := multipart.NewWriter(buf)
	boundary := writer.Boundary()
	if withAttachments {
		buf.WriteString(fmt.Sprintf("Content-Type: multipart/mixed; boundary=%s\n", boundary))
		buf.WriteString(fmt.Sprintf("--%s\n", boundary))
	} else {
		buf.WriteString("Content-Type: text/plain; charset=utf-8\n")
	}

	buf.WriteString(email.Body)

	if withAttachments {
		for k, v := range email.Attachments {
			buf.WriteString(fmt.Sprintf("\n\n--%s\n", boundary))
			buf.WriteString(fmt.Sprintf("Content-Type: %s\n", http.DetectContentType(v)))
			buf.WriteString("Content-Transfer-Encoding: base64\n")
			buf.WriteString(fmt.Sprintf("Content-Disposition: attachment; filename=%s\n", k))

			b := make([]byte, base64.StdEncoding.EncodedLen(len(v)))
			base64.StdEncoding.Encode(b, v)
			buf.Write(b)
			buf.WriteString(fmt.Sprintf("\n--%s", boundary))
		}

		buf.WriteString("--")
	}

	return buf.Bytes()
}

func (s *SMTP) sendEmailWithAttachments(email models.Email) error {
	addr := fmt.Sprintf("%+v:%+v", s.host, s.port)
	return smtp.SendMail(addr, s.auth, s.srcEmail, []string{email.To}, s.generateAttachmentsBody(email))

}

func (s *SMTP) sendHtmlEmail(email models.Email) error {
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	subject := "Subject: " + email.Title + "\n"
	msg := []byte(subject + mime + "\n" + email.Body)
	addr := fmt.Sprintf("%+v:%+v", s.host, s.port)

	return smtp.SendMail(addr, s.auth, s.srcEmail, []string{email.To}, msg)
}

func parseTemplate(data interface{}, templatePath string) (*string, error) {
	t, err := template.ParseFiles(templatePath)
	if err != nil {
		return nil, err
	}
	buf := new(bytes.Buffer)
	if err = t.Execute(buf, data); err != nil {
		return nil, err
	}
	res := buf.String()
	return &res, err
}

func addFileExtention(fileName, fileExtention string) string {
	return strings.Join([]string{fileName, fileExtention}, ".")
}
