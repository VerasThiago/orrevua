import React, { useContext, useState } from 'react';
import './index.scss';
import { ReactComponent as IconUser } from '../../images/user.svg';
import { ReactComponent as IconPassword } from '../../images/password.svg';
import InputIcon from '../../components/inputIcon';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { AuthContext } from '../../App';
import HomeSidebar from '../../components/homeSidebar';
import alertMessage from '../../components/alertMessage';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({ email: '', password: '' });
  const handleChange = (event) => {
    const value = event.target.value;
    setUser({
      ...user,
      [event.target.name]: value
    });
  };

  const onFinish = async (event) => {
    event.preventDefault();
    if (user.email === '') {
      alertMessage('error', 'Insira seu e-mail!');
    } else if (user.password.length < 6) {
      alertMessage('error', 'Sua senha deve ter no mínimo 6 caracteres');
    } else {
      const result = await login(user);
      if (result) navigate('/tickets', { replace: true, state: { from: location } });
    }
  };

  return (
    <div className="row vh-100 m-0">
      <HomeSidebar />
      <div className="col-lg-6 col-md-12 bg-secondary d-flex flex-column align-items-center justify-content-center">
        <div className="px-4" style={{ maxWidth: '450px' }}>
          <div>
            <p className="fs-2">Entrar</p>
          </div>
          <div>
            <p>Sentimos sua falta! Faça o login para começar</p>
          </div>
          <div>
            <form id="login" onSubmit={onFinish}>
              <div className="mb-3">
                <InputIcon
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  aria-describedby="email"
                  placeholder="E-mail"
                  onChange={handleChange}
                  icon={<IconUser />}
                />
              </div>
              <div>
                <InputIcon
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  aria-describedby="password"
                  placeholder="Senha"
                  onChange={handleChange}
                  icon={<IconPassword />}
                />
              </div>
              <div className="d-flex justify-content-end my-3">
                <NavLink
                  to={'/forgot_password'}
                  className="login-forgot-password text-decoration-none">
                  Esqueceu a senha?
                </NavLink>
              </div>
              <div>
                <button type="submit" className="btn btn-primary w-100 mt-5 fw-bold">
                  Entrar
                </button>
                <div className="d-flex justify-content-center p-5">
                  <p className="login-signup-forms">
                    Não tem conta?
                    <NavLink to={'/signup'} className="mx-2 text-decoration-none fw-bold">
                      Cadastre-se
                    </NavLink>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
