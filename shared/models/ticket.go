package models

import (
	b64 "encoding/base64"
	"time"

	"github.com/google/uuid"
	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

type Ticket struct {
	gorm.Model
	ID          string    `json:"id" gorm:"primary_key"`
	OwnerID     string    `json:"ownerid"`
	Name        string    `json:"name"`
	Email       string    `json:"email" gorm:"unique"`
	CPF         string    `json:"cpf" gorm:"unique"`
	IsUsed      bool      `json:"isused" gorm:"default:false"`
	UsedTime    time.Time `json:"usedtime"`
	Base64Image string    `json:"base64image"`
}

func (u *Ticket) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New().String()

	qrCode, err := qrcode.Encode(u.CPF, qrcode.Medium, 256)
	if err != nil {
		return err
	}
	u.Base64Image = b64.StdEncoding.EncodeToString(qrCode)
	return nil
}
