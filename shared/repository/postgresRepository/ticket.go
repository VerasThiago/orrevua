package postgresrepository

import (
	"time"

	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
)

const TICKET_MODEL_NAME = "Ticket"

func (p *PostgresRepository) GetTicketListByUserID(userID string) ([]*models.Ticket, error) {
	var ticketList []*models.Ticket
	if err := errors.HandleDataNotFoundError(p.db.Where("owner_id = ?", userID).Find(&ticketList).Error, TICKET_MODEL_NAME); err != nil {
		return nil, err
	}
	return ticketList, nil
}

func (p *PostgresRepository) GetTicketByID(id string) (*models.Ticket, error) {
	var ticket *models.Ticket
	if err := errors.HandleDataNotFoundError(p.db.Where("id = ?", id).First(&ticket).Error, TICKET_MODEL_NAME); err != nil {
		return nil, err
	}
	return ticket, nil
}

func (p *PostgresRepository) GetTicketByCPF(cpf string) (*models.Ticket, error) {
	var ticket *models.Ticket
	if err := errors.HandleDataNotFoundError(p.db.Where("cpf = ?", cpf).First(&ticket).Error, TICKET_MODEL_NAME); err != nil {
		return nil, err
	}
	return ticket, nil
}

func (p *PostgresRepository) CreateTicket(ticket *models.Ticket) error {
	return errors.HandleDuplicateError(p.db.Create(ticket).Error)
}

func (p *PostgresRepository) DeleteTicketByID(id string) error {
	return errors.HandleDataNotFoundError(p.db.Where("id = ?", id).Delete(&models.Ticket{}).Error, TICKET_MODEL_NAME)
}

func (p *PostgresRepository) ValidateTicketByCPF(cpf string) error {
	return errors.HandleDataNotFoundError(p.db.Model(&models.Ticket{}).Where("cpf = ?", cpf).Updates(&models.Ticket{IsUsed: true, UsedTime: time.Now()}).Error, TICKET_MODEL_NAME)
}

func (p *PostgresRepository) MigrateTicket(model *models.Ticket) error {
	return p.db.AutoMigrate(model)
}
