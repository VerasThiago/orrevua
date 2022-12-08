package postgresrepository

import (
	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
)

const USER_DATA_NAME = "User"

func (p *PostgresRepository) GetAllUsers() ([]*models.User, error) {
	var userList []*models.User
	if err := p.db.Find(&userList).Error; err != nil {
		return nil, err
	}
	return userList, nil
}

func (p *PostgresRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := errors.HandleDataNotFoundError(p.db.Where("email = ?", email).First(&user).Error, USER_DATA_NAME); err != nil {
		return nil, err
	}
	return &user, nil
}

func (p *PostgresRepository) GetUserByID(id string) (*models.User, error) {
	var user models.User
	if err := errors.HandleDataNotFoundError(p.db.Where("id = ?", id).First(&user).Error, USER_DATA_NAME); err != nil {
		return nil, err
	}
	return &user, nil
}

// TODO: Use preload to handle in 1 query (need to fix the foreign key)
func (p *PostgresRepository) GetUserWithTicketsByID(id string) (*models.User, error) {
	var err error
	var user *models.User

	if user, err = p.GetUserByID(id); err != nil {
		return nil, err
	}

	if user.TicketList, err = p.GetTicketListByUserID(id); err != nil {
		return nil, err
	}

	return user, nil
}

func (p *PostgresRepository) CreateUser(user *models.User) error {
	return errors.HandleDuplicateError(p.db.Create(user).Error)
}

func (p *PostgresRepository) UpdateUser(user *models.User) error {
	if user.Password != "" {
		if err := user.HashPassword(user.Password); err != nil {
			return err
		}
	}
	return errors.HandleDataNotFoundError(p.db.Model(user).Updates(user).Error, USER_DATA_NAME)
}

func (p *PostgresRepository) DeleteUser(userID string) error {
	return errors.HandleDataNotFoundError(p.db.Where("id = ?", userID).Delete(&models.User{}).Error, USER_DATA_NAME)
}

func (p *PostgresRepository) UpdateUserPasswordByEmail(email string, password string) error {
	user := models.User{}
	if err := user.HashPassword(password); err != nil {
		return err
	}
	return errors.HandleDataNotFoundError(p.db.Model(&models.User{}).Where("email = ?", email).Update("password", user.Password).Error, USER_DATA_NAME)
}

func (p *PostgresRepository) VerifyUserAccountByID(id string) error {
	return errors.HandleDataNotFoundError(p.db.Model(&models.User{}).Where("id = ?", id).Update("is_verified", true).Error, USER_DATA_NAME)
}

func (p *PostgresRepository) MigrateUser(model *models.User) error {
	return p.db.AutoMigrate(model)
}
