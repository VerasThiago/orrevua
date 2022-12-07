import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as IconMenu } from '../../../images/qr_code.svg';
import AdminTicket from './ticket';

export default function AdminUserTickets() {
  const { userId } = useParams();
  const user = {
    id: userId,
    name: 'Fake Name',
    cpf: '000.000.000-00',
    tickets: [
      {
        id: 111,
        qr_code: '...1'
      },
      {
        id: 222,
        qr_code: '...2'
      }
    ]
  };

  return (
    <div className="vh-100 m-0 p-4">
      <p className="h1 text-white pb-4">Ingressos</p>
      <div className="d-flex gap-3 justify-content-start mb-4">
        <div>
          <p className="fs-4 fw-bold text-white mb-1">{user.name}</p>
          <p className="text-white">CPF {user.cpf}</p>
        </div>
        <div className="pt-2">
          <button className="btn btn-primary rounded-pill px-4">
            <IconMenu className="me-2" />
            Criar ingresso
          </button>
        </div>
      </div>

      <div className="row gap-4">
        {user.tickets.map(function (ticket) {
          return <AdminTicket key={ticket.id} ticket={ticket} user={user} />;
        })}
      </div>
    </div>
  );
}
