package postgresrepository

import (
	"time"

	"github.com/verasthiago/tickets-generator/shared/errors"
	"github.com/verasthiago/tickets-generator/shared/models"
	"gorm.io/gorm"
)

func (p *PostgresRepository) GetTicketListByUserID(userID string) ([]*models.Ticket, error) {
	var ticketList []*models.Ticket
	if record := p.db.Where("owner_id = ?", userID).Find(&ticketList); record.Error != nil {
		if record.Error == gorm.ErrRecordNotFound {
			return nil, errors.GenericError{
				Code:    errors.STATUS_NOT_FOUND,
				Err:     record.Error,
				Message: "Ticket not found",
			}
		}
		return nil, record.Error
	}
	return ticketList, nil
}

func (p *PostgresRepository) GetTicketByID(id string) (*models.Ticket, error) {
	var ticket *models.Ticket
	if record := p.db.Where("id = ?", id).First(&ticket); record.Error != nil {
		if record.Error == gorm.ErrRecordNotFound {
			return nil, errors.GenericError{
				Code:    errors.STATUS_NOT_FOUND,
				Err:     record.Error,
				Message: "Ticket not found",
			}
		}
		return nil, record.Error
	}
	return ticket, nil
}

func (p *PostgresRepository) GetTicketByCPF(cpf string) (*models.Ticket, error) {
	var ticket *models.Ticket
	if record := p.db.Where("cpf = ?", cpf).First(&ticket); record.Error != nil {
		if record.Error == gorm.ErrRecordNotFound {
			return nil, errors.GenericError{
				Code:    errors.STATUS_NOT_FOUND,
				Err:     record.Error,
				Message: "Ticket not found",
			}
		}
		return nil, record.Error
	}
	return ticket, nil
}

func (p *PostgresRepository) CreateTicket(ticket *models.Ticket) error {
	return p.db.Create(ticket).Error
}

func (p *PostgresRepository) DeleteTicketByID(id string) error {
	return p.db.Where("id = ?", id).Delete(&models.Ticket{}).Error
}

func (p *PostgresRepository) ValidateTicketByCPF(cpf string) error {
	return p.db.Model(&models.Ticket{}).Where("cpf = ?", cpf).Updates(&models.Ticket{IsUsed: true, UsedTime: time.Now()}).Error
}
