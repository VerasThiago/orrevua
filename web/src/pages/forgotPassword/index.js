import React from 'react';
import { ReactComponent as IconMenu } from '../../images/logo.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';

export default function Login() {
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
      <div className="col-lg-6 col-md-12 d-flex flex-column justify-content-center header">
        <div className="row justify-content-center h-50">
          <div className="col-md-8 col-lg-8 d-flex flex-column justify-content-between">
            <div className="d-flex">
              <IconMenu className="me-2" />
              <p className="header-title">ourevuá</p>
            </div>
            <p className="title-login h-50">Seus ingressos na palma da mão</p>
          </div>
        </div>
      </div>
      <div className="col-lg-6 col-md-12 bg-secondary d-flex flex-column align-items-center justify-content-center">
        <div className="col-md-6">
          <p className="login-title-forms">Esqueceu sua senha?</p>
        </div>
        <div className="col-md-6">
          <p className="login-greeting-forms">
            Informe seu e-mail e enviaremos instruções para você criar sua nova senha.
          </p>
        </div>
        <div className="col-md-6">
          <form id="forgot_password" onSubmit={onFinish}>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control text-white rounded-pill p-3 bg-dark"
              aria-describedby="email"
              placeholder="E-mail"
            />

            <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 mt-5 fw-bold">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
