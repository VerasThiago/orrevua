package models

import (
	"strings"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type User struct {
	gorm.Model
	ID         string    `json:"id" gorm:"primary_key"`
	Name       string    `json:"name"`
	Email      string    `json:"email" gorm:"unique"`
	CPF        string    `json:"cpf" gorm:"unique"`
	Password   string    `json:"password"`
	TicketList []*Ticket `json:"ticketlist,omitempty" gorm:"ForeignKey:OwnerID"`
	IsAdmin    bool      `json:"isadmin" gorm:"default:false"`
	IsVerified bool      `json:"isverified" gorm:"default:false"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New().String()
	u.Email = strings.ToLower(u.Email)
	u.Name = cases.Title(language.BrazilianPortuguese).String(u.Name)
	return nil
}

func (user *User) HashPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}
	user.Password = string(bytes)
	return nil
}

func (user *User) CheckPassword(providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}
