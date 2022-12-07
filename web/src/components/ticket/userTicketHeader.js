import { ReactComponent as TrashIcon } from '../../images/trash.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../alertMessage';

export default function UserTicketHeader({ owner, ticket, reloadTickets }) {
  const handleDelete = () => {
    if (!confirm('Tem certeza que deseja deletar esse ingresso?')) return;

    apiRequest('api', `api/v0/ticket/delete`, 'delete', { id: ticket.id })
      .then(async (response) => {
        const parsedResponse = await response.json();
        if (response.ok) {
          if (parsedResponse.message) alertMessage('success', 'Ingresso deletado com sucesso');
          reloadTickets();
        } else {
          if (parsedResponse.message) alertMessage('error', parsedResponse.message);
        }
      })
      .catch(() => {
        alertMessage('error', 'Ocorreu um erro inesperado');
      });
  };

  return (
    <div className="p-3 d-flex gap-3">
      <div className="py-2 rounded-circle bg-primary p-3" style={{ width: '40px', height: '40px' }}>
        <span>{owner.name.split('')[0].toUpperCase()}</span>
      </div>
      <div>
        <div>{ticket.name}</div>
        <div>
          <small>Ingresso individual</small>
        </div>
      </div>
      {owner.isadmin === true && (
        <div className="ms-auto fs-4" role="button">
          <TrashIcon style={{ color: 'crimson' }} onClick={handleDelete} />
        </div>
      )}
    </div>
  );
}
