import React from 'react';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import InputIcon from '../../components/inputIcon';
import HomeSidebar from '../../components/homeSidebar';

export default function ForgotPassword() {
  const onFinish = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target));

    apiRequest('login', 'login/v0/user/password/forget', 'post', { email: values.email })
      .then(async (response) => {
        if (response.ok) {
          alertMessage('success', 'Você recebeu um email com instruções para trocar sua senha');
          event.target.reset();
        } else {
          alertMessage('error', 'Ocorreu um erro inesperado');
        }
      })
      .catch(() => {
        alertMessage('error', 'Ocorreu um erro inesperado');
      });
  };

  return (
    <div className="row vh-100 m-0">
      <HomeSidebar />
      <div className="col-lg-6 col-md-12 bg-secondary d-flex flex-column align-items-center justify-content-center">
        <div className="px-4" style={{ maxWidth: '450px' }}>
          <div>
            <p className="fs-2">Esqueceu sua senha?</p>
          </div>
          <div>
            <p>Informe seu e-mail e enviaremos instruções para você criar sua nova senha.</p>
          </div>
          <div>
            <form id="forgot_password" onSubmit={onFinish}>
              <div>
                <InputIcon
                  id="email"
                  name="email"
                  type="email"
                  className="form-control rounded-pill p-3 bg-dark"
                  aria-describedby="email"
                  placeholder="E-mail"
                  icon={<IconEmail />}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-3 mt-5 fw-bold">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
