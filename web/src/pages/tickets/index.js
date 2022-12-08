import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../App';
import Ticket from '../../components/ticket/ticket';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import Loading from '../../components/loading';

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
      <p className="h1 text-white pb-4">Meus ingressos</p>

      <div className="row gap-4">
        {!user.ticketlist || user.ticketlist.length === 0 ? (
          <div className="text-center fs-2">Você não possui nenhum ingresso :(</div>
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
