import React, { useState } from 'react';
import TicketMobile from './ticketMobile';
import TicketDesktop from './ticketDesktop';

export default function Ticket({ ticket, user, reloadTickets, hideDelete }) {
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const showQrCode = () => {
    setQrCodeVisible(!qrCodeVisible);
  };

  return (
    <>
      <TicketDesktop
        ticket={ticket}
        user={user}
        reloadTickets={reloadTickets}
        hideDelete={hideDelete}
        qrCodeVisible={qrCodeVisible}
        showQrCode={showQrCode}
      />
      <TicketMobile ticket={ticket} qrCodeVisible={qrCodeVisible} showQrCode={showQrCode} />
    </>
  );
}
