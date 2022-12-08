import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ReactComponent as LogoIcon } from '../images/logo.svg';
import { ReactComponent as LogoutIcon } from '../images/logout.svg';
import { ReactComponent as TicketIcon } from '../images/ticket.svg';
import { ReactComponent as SettingsIcon } from '../images/settings.svg';
import { AuthContext } from '../App';

export default function Menu() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Meus ingressos',
      icon: <TicketIcon />,
      path: location.pathname.includes('/admin') ? '/admin/users' : '/tickets',
      active: location.pathname.includes('/tickets') || location.pathname.includes('/admin'),
      hidden: false
    },
    {
      title: 'Configurações',
      icon: <SettingsIcon />,
      path: '/settings',
      active: location.pathname.includes('/settings'),
      hidden: location.pathname.includes('/admin')
    }
  ];

  return (
    <div className="d-flex flex-column h-100 bg-dark gap-2 justify-content-between">
      <div>
        <div className="d-flex justify-content-center align-items-center gap-2 py-5">
          <LogoIcon />
          <span className="fw-bold fs-2">orrevuá</span>
        </div>
        <div className="d-flex flex-column align-items-center gap-3">
          {menuItems.map((menuItem, index) => (
            <div
              key={`menu_${index}`}
              className={`${menuItem.active && 'bg-primary'} ${
                menuItem.hidden && 'visually-hidden'
              } px-4 py-2 rounded-pill`}
              role="button">
              <Link
                to={menuItem.path}
                state={{ from: location }}
                className="text-decoration-none text-white">
                {menuItem.icon}
                <span className="ms-2">{menuItem.title}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center mb-5" role="button" onClick={() => logout()}>
        <LogoutIcon className="me-2" />
        <span>Sair</span>
      </div>
    </div>
  );
}
