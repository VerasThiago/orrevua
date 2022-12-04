package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Ticket struct {
	gorm.Model
	ID       string    `json:"id" gorm:"primary_key"`
	OwnerID  string    `json:"ownerid"`
	Name     string    `json:"name"`
	Email    string    `json:"email" gorm:"unique"`
	CPF      string    `json:"cpf" gorm:"unique"`
	IsUsed   bool      `json:"isused" gorm:"default:false"`
	UsedTime time.Time `json:"usedtime"`
}

func (u *Ticket) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New().String()
	return nil
}
