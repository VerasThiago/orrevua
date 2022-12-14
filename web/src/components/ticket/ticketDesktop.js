import React from 'react';
import { ReactComponent as IconMenu } from '../../images/qr_code.svg';
import UserTicketHeader from './userTicketHeader';

export default function TicketDesktop({
  ticket,
  user,
  reloadTickets,
  hideDelete,
  qrCodeVisible,
  showQrCode
}) {
  return (
    <div className="col-lg-3 col-md-12 rounded-3 py-0 px-0 bg-dark d-none d-lg-block">
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
        <div className="d-flex align-items-center" style={{ minHeight: '256px' }}>
          <img src="/images/ticket-img.png" alt="ticket image" className="img-fluid" />
        </div>
      )}

      <div className="p-3">
        <p className="fw-bold">Despedida do Veras</p>
        <small>23 de Dezembro de 2022 às 20h</small>
        <br />
        <small>
          Espaço Mocambo, St. de Habitações Individuais Norte Trecho 1 - Lago Norte, Brasília - DF,
          71560-100
        </small>
      </div>
      <div className="p-3 pt-4">
        <button className="btn btn-primary py-2 w-100" onClick={showQrCode}>
          {!qrCodeVisible && <IconMenu className="me-2" />}
          <small>{qrCodeVisible ? 'Voltar' : 'QR Code'}</small>
        </button>
      </div>
    </div>
  );
}
