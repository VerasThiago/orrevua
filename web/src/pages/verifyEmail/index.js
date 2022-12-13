import React, { useState, useEffect } from 'react';
import alertMessage from '../../components/alertMessage';
import HomeSidebar from '../../components/homeSidebar';
import { apiRequest } from '../../services/api';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userIsVerified, setUserIsVerified] = useState(false);

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    });
    let token = params.token;
    apiRequest('login', 'login/v0/user/email/verify', 'PATCH', {}, { Authorization: token })
      .then(async (response) => {
        if (response.ok) {
          setUserIsVerified(true);
          setTimeout(() => {
            navigate('/login', { replace: true, state: { from: location } });
          }, 5000);
        } else {
          alertMessage('error', null);
        }
      })
      .catch(() => {
        alertMessage('error', null);
      });
  }, []);

  if (!userIsVerified) {
    return (
      <div className="row vh-100 m-0">
        <HomeSidebar />
        <div className="col-lg-6 col-md-12 bg-secondary d-flex flex-column align-items-center justify-content-center">
          <div className="px-4" style={{ maxWidth: '450px' }}>
            <p className="fs-2">Confirmando seu email!</p>
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row vh-100 m-0">
      <HomeSidebar />
      <div className="col-lg-6 col-md-12 bg-secondary d-flex flex-column align-items-center justify-content-center">
        <div className="px-4" style={{ maxWidth: '450px' }}>
          <p className="fs-2">Seu email foi confirmado!</p>
          <p>Você será redirecionado para página de login</p>
          <p>
            Ou clique{' '}
            <NavLink replace to={'/login'}>
              aqui
            </NavLink>{' '}
            para ir agora
          </p>
        </div>
      </div>
    </div>
  );
}
