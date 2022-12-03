package repository

import (
	"github.com/verasthiago/tickets-generator/shared/models"
)

type Repository interface {
	GetUserByEmail(email string) (*models.User, error)
	CreateUser(user *models.User) error
	DeleteUser(userID string) error
	UpdateUser(user *models.User) error
	UpdateUserPasswordByEmail(email string, password string) error
	VerifyUserAccountByID(id string) error
}
