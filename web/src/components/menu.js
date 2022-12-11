import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ReactComponent as LogoIcon } from '../images/logo.svg';
import { ReactComponent as LogoutIcon } from '../images/logout.svg';
import { ReactComponent as TicketIcon } from '../images/ticket.svg';
import { ReactComponent as SettingsIcon } from '../images/settings.svg';
import { ReactComponent as UserIcon } from '../images/user.svg';
import { AuthContext } from '../App';

import 'bootstrap/js/src/collapse.js';

export default function Menu() {
  const { logout, userData } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Ingressos',
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
    <div>
      <nav className="navbar navbar-dark navbar-expand-lg">
        <div className="container-fluid flex-lg-wrap justify-content-lg-center">
          <div className="d-flex align-items-center gap-2 py-2 py-lg-5">
            <LogoIcon />
            <Link to="/tickets" state={{ from: location }} className="navbar-brand fs-3">
              orrevuá
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuNav"
            aria-controls="menuNav"
            aria-expanded="false"
            aria-label="Toggle navigation menu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menuNav">
            <ul className="navbar-nav d-flex flex-column">
              {menuItems.map((menuItem, index) => {
                if (menuItem.admin && !userData().User.isadmin === true) return null;

                return (
                  <li key={`menu_${index}`} className="nav-item">
                    <Link
                      to={menuItem.path}
                      state={{ from: location }}
                      className={`nav-link${menuItem.active ? ' active' : ''}`}>
                      <div
                        className={`${menuItem.active && 'bg-primary'} px-4 py-2 rounded-pill`}
                        role="button">
                        <span>
                          {menuItem.icon}
                          <span className="ms-2">{menuItem.title}</span>
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
              <li key="menu_logout" className="nav-item">
                <a className="nav-link">
                  <div className="px-4 py-2 rounded-pill" role="button" onClick={() => logout()}>
                    <span>
                      <LogoutIcon />
                      <span className="ms-2">Sair</span>
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
