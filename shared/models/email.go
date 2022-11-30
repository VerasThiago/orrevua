package models

type Email struct {
	To          string
	Title       string
	Body        string
	Attachments map[string][]byte
}
