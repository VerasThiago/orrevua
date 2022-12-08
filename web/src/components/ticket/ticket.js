import React, { useState } from 'react';
import { ReactComponent as IconMenu } from '../../images/qr_code.svg';
import ticketImg from './ticket-img.png';
import UserTicketHeader from './userTicketHeader';

export default function Ticket({ ticket, user, reloadTickets, hideDelete }) {
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const showQrCode = () => {
    setQrCodeVisible(!qrCodeVisible);
  };

  return (
    <div className="col-lg-3 col-md-12 rounded-3 py-0 px-0" style={{ backgroundColor: '#1f1f1f' }}>
      <UserTicketHeader
        owner={user}
        ticket={ticket}
        reloadTickets={reloadTickets}
        hideDelete={hideDelete}
      />
      {qrCodeVisible === true ? (
        <div className="text-center">
          <img
            className="img-fluid"
            src={`data:image/png;base64, ${ticket.base64image}`}
            alt="QR Code"
          />
        </div>
      ) : (
        <img src={ticketImg} alt="ticket image" className="img-fluid" />
      )}

      <div className="p-3">
        <p className="fw-bold">Despedida do Veras</p>
        <span>23 de Dezembro de 2022 às 20h</span>
        <br />
        <span>
          Espaço Mocambo, St. de Habitações Individuais Norte Trecho 1 - Lago Norte, Brasília - DF,
          71560-100
        </span>
      </div>
      <div className="p-3 pt-4">
        <button className="btn btn-primary rounded-pill w-100" onClick={showQrCode}>
          <IconMenu className="me-2" />
          <small>QR Code</small>
        </button>
      </div>
    </div>
  );
}
