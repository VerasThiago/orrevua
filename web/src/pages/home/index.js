import React from 'react';
import InfoLandingPage from '../../components/landingpage/infosLandingPage';
import HomeNavbar from '../../components/landingpage/homeNavbar';
import './index.scss';

export default function index() {
  return (
    <>
      <HomeNavbar />
      <hr />
      <div className="landing-page d-flex flex-column justify-content-center align-items-center">
        <h1 className="mark text-secondary">Despedida Thiago Veras</h1>
        <h2 className="mark text-secondary">23 de dezembro às 20hrs</h2>
        <h2 className="mark text-secondary">Espaço Mocambo</h2>
      </div>
      <InfoLandingPage />
    </>
  );
}
