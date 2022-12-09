import React, { useState } from 'react';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { ReactComponent as IconName } from '../../images/name_icon.svg';
import { ReactComponent as IconCpf } from '../../images/badge.svg';
import { ReactComponent as IconPassowrd } from '../../images/password.svg';

import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import InputIcon from '../../components/inputIcon';
import HomeSidebar from '../../components/homeSidebar';
import { formatCpf, formatToRequestCpf } from '../../utils';
import { NavLink } from 'react-router-dom';

export default function SignUp() {
  const [user, setUser] = useState({ name: '', cpf: '', email: '', password: '' });

  const handleChange = (event) => {
    const value = event.target.value;
    if (event.target.name === 'cpf') {
      setUser({
        ...user,
        [event.target.name]: formatCpf(value)
      });
    } else {
      setUser({
        ...user,
        [event.target.name]: value
      });
    }
  };

  const onFinish = async (event) => {
    event.preventDefault();
    console.log(formatToRequestCpf(user.cpf));
    if (user.name === '') {
      alertMessage('error', 'Informe seu nome!');
    } else if (user.email === '') {
      alertMessage('error', 'Informe seu email!');
    } else if (user.password === '') {
      alertMessage('error', 'Insira uma senha');
    } else if (user.cpf === '') {
      alertMessage('error', 'Informe seu cpf!');
    } else {
      apiRequest('login', 'login/v0/user/signup', 'post', {
        name: user.name,
        username: formatToRequestCpf(user.cpf),
        email: user.email,
        cpf: formatToRequestCpf(user.cpf),
        password: user.password
      })
        .then(async (response) => {
          if (response.ok) {
            alertMessage('success', 'Você recebeu um email para confirmar sua conta!');
            event.target.reset();
          } else {
            alertMessage('error', 'Ocorreu um erro inesperado');
          }
        })
        .catch(() => {
          alertMessage('error', 'Ocorreu um erro inesperado');
        });
    }
  };

  return (
    <div className="row vh-100 m-0">
      <HomeSidebar />
      <div className="col-lg-6 col-md-12 bg-secondary d-flex flex-column align-items-center justify-content-center">
        <div className="px-4" style={{ maxWidth: '450px' }}>
          <div>
            <p className="fs-2">Cadastrar</p>
          </div>
          <div>
            <p>Crie uma conta para garantir os seus ingressos</p>
          </div>
          <div>
            <form id="forgot_password" onSubmit={onFinish}>
              <div className="mb-4">
                <InputIcon
                  id="name"
                  name="name"
                  type="text"
                  value={user.name}
                  className="form-control"
                  aria-describedby="name"
                  placeholder="Nome completo"
                  onChange={handleChange}
                  icon={<IconName />}
                />
              </div>
              <div className="mb-4">
                <InputIcon
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  className="form-control"
                  aria-describedby="email"
                  placeholder="E-mail"
                  onChange={handleChange}
                  icon={<IconEmail />}
                />
              </div>
              <div className="mb-4">
                <InputIcon
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={user.cpf}
                  className="form-control"
                  aria-describedby="cpf"
                  placeholder="CPF"
                  onChange={handleChange}
                  icon={<IconCpf />}
                />
              </div>
              <div>
                <InputIcon
                  id="password"
                  name="password"
                  type="password"
                  value={user.password}
                  className="form-control"
                  aria-describedby="password"
                  placeholder="Senha"
                  onChange={handleChange}
                  icon={<IconPassowrd />}
                />
              </div>

              <div>
                <button type="submit" className="btn btn-primary w-100 mt-5 fw-bold">
                  Cadastrar
                </button>
              </div>
            </form>
            <p className="text-center my-5">
              Já tem conta?
              <NavLink to={'/login'} className="mx-2 text-decoration-none fw-bold">
                Entrar agora
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
