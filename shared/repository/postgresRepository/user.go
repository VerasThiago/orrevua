package postgresrepository

import (
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
	"gorm.io/gorm"
)

func (p *PostgresRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if record := p.db.Where("email = ?", email).First(&user); record.Error != nil {
		return nil, record.Error
	}
	return &user, nil
}

func (p *PostgresRepository) GetUserByID(id string) (*models.User, error) {
	var user models.User
	if record := p.db.Where("id = ?", id).First(&user); record.Error != nil {
		if record.Error == gorm.ErrRecordNotFound {
			return nil, errors.GenericError{
				Code:    errors.STATUS_NOT_FOUND,
				Err:     record.Error,
				Message: "User not found",
			}
		}
		return nil, record.Error
	}
	return &user, nil
}

func (p *PostgresRepository) CreateUser(user *models.User) error {
	return p.db.Create(user).Error
}

func (p *PostgresRepository) UpdateUser(user *models.User) error {
	if user.Password != "" {
		if err := user.HashPassword(user.Password); err != nil {
			return err
		}
	}
	return p.db.Model(user).Updates(user).Error
}

func (p *PostgresRepository) DeleteUser(userID string) error {
	return p.db.Where("id = ?", userID).Delete(&models.User{}).Error
}

func (p *PostgresRepository) UpdateUserPasswordByEmail(email string, password string) error {
	user := models.User{}
	if err := user.HashPassword(password); err != nil {
		return err
	}
	return p.db.Model(&models.User{}).Where("email = ?", email).Update("password", user.Password).Error
}

func (p *PostgresRepository) VerifyUserAccountByID(id string) error {
	return p.db.Model(&models.User{}).Where("id = ?", id).Update("is_verified", true).Error
}
