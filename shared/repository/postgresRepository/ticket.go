package postgresrepository

import (
	"time"

	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
)

const TICKET_DATA_NAME = "ticket"

func (p *PostgresRepository) GetTicketListByUser(user *models.User) ([]*models.Ticket, error) {
	var ticketList []*models.Ticket
	if err := errors.HandleDataNotFoundError(p.db.Where("owner_id = ? or cpf = ?", user.ID, user.CPF).Find(&ticketList).Error, TICKET_DATA_NAME); err != nil {
		return nil, err
	}

	return ticketList, nil
}

func (p *PostgresRepository) GetTicketByID(id string) (*models.Ticket, error) {
	var ticket *models.Ticket
	if err := errors.HandleDataNotFoundError(p.db.Where("id = ?", id).First(&ticket).Error, TICKET_DATA_NAME); err != nil {
		return nil, err
	}
	return ticket, nil
}

func (p *PostgresRepository) GetTicketByCPF(cpf string) (*models.Ticket, error) {
	var ticket *models.Ticket
	if err := errors.HandleDataNotFoundError(p.db.Where("cpf = ?", cpf).First(&ticket).Error, TICKET_DATA_NAME); err != nil {
		return nil, err
	}
	return ticket, nil
}

func (p *PostgresRepository) CreateTicket(ticket *models.Ticket) error {
	return errors.HandleDuplicateError(p.db.Create(ticket).Error)
}

func (p *PostgresRepository) DeleteTicketByID(id string) error {
	return errors.HandleDataNotFoundError(p.db.Where("id = ?", id).Delete(&models.Ticket{}).Error, TICKET_DATA_NAME)
}

func (p *PostgresRepository) ValidateTicketByCPF(cpf string) (*models.Ticket, error) {
	ticket := &models.Ticket{}
	if err := errors.HandleDataNotFoundError(p.db.Model(ticket).Where("cpf = ?", cpf).Updates(&models.Ticket{IsUsed: true, UsedTime: time.Now()}).Error, TICKET_DATA_NAME); err != nil {
		return nil, err
	}
	return ticket, nil
}

func (p *PostgresRepository) MigrateTicket(model *models.Ticket) error {
	return p.db.AutoMigrate(model)
}
