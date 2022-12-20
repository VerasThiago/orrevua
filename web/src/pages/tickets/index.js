import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../App';
import Ticket from '../../components/ticket/ticket';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import Loading from '../../components/loading';
import Header from '../../components/header';

export default function Tickets() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userData } = useContext(AuthContext);

  useEffect(() => {
    reloadTickets();
  }, []);

  const reloadTickets = () => {
    setLoading(true);
    apiRequest('login', `login/v0/user/${userData().User.id}`, 'get')
      .then(async (response) => {
        const responseBody = await response.json();
        if (response.ok) {
          setUser(responseBody.data);
        } else {
          alertMessage('error', responseBody.error);
        }
      })
      .catch(() => {
        alertMessage('error', null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Header title="Meus ingressos" />

      <div className="row gap-4 m-0">
        {!user.ticketlist || user.ticketlist.length === 0 ? (
          <div className="row justify-content-center align-items-center">
            <div className="col-12 fs-2 mb-4 text-center">Você ainda não possui ingressos</div>
            <div className="col-12" style={{ maxWidth: '350px' }}>
              <img
                src="/images/empty-tickets.svg"
                className="img-fluid"
                alt="Empty tickets image"
              />
            </div>
          </div>
        ) : (
          user.ticketlist.map(function (ticket) {
            return (
              <Ticket
                key={ticket.id}
                user={user}
                ticket={ticket}
                reloadTickets={reloadTickets}
                hideDelete={true}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
