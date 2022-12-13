import React from 'react';
import { ReactComponent as LogoIcon } from '../../images/logo.svg';

export default function HomeNavbar() {
  return (
    <nav
      className="navbar navbar-dark navbar-expand-lg bg-secondary fixed-top border-bottom border-white"
      style={{ ['--bs-border-opacity']: '.2' }}>
      <div className="container-fluid mx-5">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <LogoIcon />
          <span className="fs-3 fw-bold mx-2">Orrevuá</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
          <div className="navbar-nav d-flex align-items-center">
            <a className="nav-link text-white fs-5 fw-bold px-3" aria-current="page" href="/login">
              Login
            </a>
            <a className="nav-link text-white fs-5 fw-bold px-3" href="/signup">
              Cadastro
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
