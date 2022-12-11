import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ReactComponent as LogoIcon } from '../images/logo.svg';
import { ReactComponent as LogoutIcon } from '../images/logout.svg';
import { ReactComponent as TicketIcon } from '../images/ticket.svg';
import { ReactComponent as SettingsIcon } from '../images/settings.svg';
import { ReactComponent as UserIcon } from '../images/user.svg';
import { AuthContext } from '../App';

export default function Menu() {
  const { logout, userData } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Meus ingressos',
      icon: <TicketIcon />,
      path: '/tickets',
      active: location.pathname.includes('/tickets'),
      admin: false
    },
    {
      title: 'Usuários',
      icon: <UserIcon />,
      path: '/admin/users',
      active: location.pathname.includes('/admin/users'),
      admin: true
    },
    {
      title: 'Configurações',
      icon: <SettingsIcon />,
      path: '/settings',
      active: location.pathname.includes('/settings'),
      admin: false
    }
  ];

  return (
    <div className="d-flex flex-column h-100 bg-dark gap-2 justify-content-between">
      <div>
        <div className="d-flex justify-content-center align-items-center gap-2 py-2 py-lg-5">
          <LogoIcon />
          <span className="fw-bold fs-2">orrevuá</span>
        </div>
        <nav className="navbar d-flex flex-column align-items-center gap-3">
          {menuItems.map((menuItem, index) => {
            if (menuItem.admin && !userData().User.isadmin === true) return null;

            return (
              <Link
                key={`menu_${index}`}
                to={menuItem.path}
                state={{ from: location }}
                className="text-decoration-none text-white">
                <div
                  className={`${menuItem.active && 'bg-primary'} px-4 py-2 rounded-pill`}
                  role="button">
                  <span className="ms-2">
                    {menuItem.icon}
                    <span className="ms-2">{menuItem.title}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="d-flex justify-content-center mb-5" role="button" onClick={() => logout()}>
        <LogoutIcon className="me-2" />
        <span>Sair</span>
      </div>
    </div>
  );
}
