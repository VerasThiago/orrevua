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
        const parsedResponse = await response.json();
        if (response.ok) {
          setUser(parsedResponse.data);
        } else {
          if (parsedResponse.message) alertMessage('error', parsedResponse.message);
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
