import React from 'react';
import ticketImgResponsive from './ticket-img-responsive.png';

export default function TicketMobile({ ticket, showQrCode, qrCodeVisible }) {
  if (qrCodeVisible === true) {
    return (
      <div className="d-flex flex-column bg-dark rounded-4 p-3 d-lg-none">
        <span className="fw-bold fs-5 mb-2">Despedida do Veras</span>
        <span className="fw-bold">{ticket.name}</span>
        <small>23 de Dezembro de 2022 às 20h</small>
        <small>
          Espaço Mocambo, St. de Habitações Individuais Norte Trecho 1 - Lago Norte, Brasília - DF,
          71560-100
        </small>
        <img
          className="img-fluid my-4"
          src={`data:image/png;base64, ${ticket.base64image}`}
          alt="QR Code"
        />
        <button className="btn btn-primary px-3 rounded-pill w-100" onClick={showQrCode}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div
      className="col-12 rounded-3 py-0 px-0 bg-primary d-lg-none"
      role="button"
      onClick={showQrCode}>
      <div className="d-flex align-items-center">
        <div className="col-9 px-3 py-1 d-flex flex-column">
          <small className="fw-bold">Despedida do Veras</small>
          <small>{ticket.name}</small>
          <small>23 de Dezembro de 2022 às 20h</small>
        </div>
        <div className="col-3">
          <img src={ticketImgResponsive} alt="ticket image" className="img-fluid float-end" />
        </div>
      </div>
    </div>
  );
}
