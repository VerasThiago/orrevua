import { useContext } from 'react';
import { AuthContext } from '../../App';
import { ReactComponent as TrashIcon } from '../../images/trash.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../alertMessage';
import CircleAvatar from '../circleAvatar';

export default function UserTicketHeader({ ticket, reloadTickets, hideDelete }) {
  const { userData } = useContext(AuthContext);

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
        alertMessage('error', null);
      });
  };

  return (
    <div className="p-3 d-flex gap-3">
      <CircleAvatar userName={ticket.name} />
      <div>
        <div>{ticket.name}</div>
        <div>
          <small>Ingresso individual</small>
        </div>
      </div>
      {userData().User.isadmin === true && !hideDelete && (
        <div className="ms-auto fs-4" role="button">
          <TrashIcon style={{ color: 'crimson' }} onClick={handleDelete} />
        </div>
      )}
    </div>
  );
}
