import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as IconMenu } from '../../../images/qr_code.svg';
import Ticket from '../../../components/ticket/ticket';
import { apiRequest } from '../../../services/api';
import alertMessage from '../../../components/alertMessage';
import Loading from '../../../components/loading';
import { formatCpf } from '../../../utils';

export default function AdminUserTickets() {
  const { userId } = useParams();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reloadTickets();
  }, []);

  const reloadTickets = () => {
    setLoading(true);
    apiRequest('login', `login/v0/user/${userId}`, 'get')
      .then(async (response) => {
        const parsedResponse = await response.json();
        if (response.ok) {
          setUser(parsedResponse.data);
        } else {
          if (parsedResponse.message) alertMessage('error', parsedResponse.message);
        }
      })
      .catch(() => {
        alertMessage('error', 'Ocorreu um erro inesperado');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="vh-100 m-0 p-4">
      <p className="h1 text-white pb-4">Ingressos</p>
      <div className="d-flex gap-3 justify-content-start mb-4">
        <div>
          <p className="fs-4 fw-bold text-white mb-1">{user.name}</p>
          <p className="text-white">CPF {formatCpf(user.cpf)}</p>
        </div>
        <div className="pt-2">
          <button className="btn btn-primary rounded-pill px-4">
            <IconMenu className="me-2" />
            Criar ingresso
          </button>
        </div>
      </div>

      <div className="row gap-4">
        {!user.ticketlist || user.ticketlist.length === 0 ? (
          <div className="text-center fs-2">Você não possui nenhum ingresso :(</div>
        ) : (
          user.ticketlist.map(function (ticket) {
            return (
              <Ticket key={ticket.id} user={user} ticket={ticket} reloadTickets={reloadTickets} />
            );
          })
        )}
      </div>
    </div>
  );
}
