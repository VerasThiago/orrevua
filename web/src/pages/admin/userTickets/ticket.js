import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as IconMenu } from '../../../images/qr_code.svg';
import ticketImg from './ticket-img.png';
import UserTicketHeader from './userTicketHeader';

export default function AdminTicket({ ticket, user, id }) {
  return (
    <div
      key={id}
      className="col-lg-3 col-md-12 rounded py-0 px-0"
      style={{ backgroundColor: '#1f1f1f' }}>
      <UserTicketHeader user={user} />
      <img src={ticketImg} alt="ticket image" className="img-fluid" />
      <div className="p-3">
        <p className="fw-bold">Despedida do Veras</p>
        <span>23 de Novembro de 2022 - 18:00 às 21:00</span>
        <br />
        <span>Endereço do local do evento completo</span>
      </div>
      <div className="p-3 pt-4">
        <button className="btn btn-primary rounded-pill w-100">
          <IconMenu className="me-2" />
          <small>QR Code</small>
        </button>
      </div>
    </div>
  );
}
