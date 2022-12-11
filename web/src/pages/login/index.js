import React, { useContext } from 'react';
import './index.scss';
import { ReactComponent as IconUser } from '../../images/user.svg';
import { ReactComponent as IconPassword } from '../../images/password.svg';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { AuthContext } from '../../App';
import HomeSidebar from '../../components/homeSidebar';

import { useForm } from 'react-hook-form';
import { Input, Button, emailPattern, errorMessages } from '../../components/form/inputs';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onFinish = async (values) => {
    const result = await login(values);
    if (result) navigate('/tickets', { replace: true, state: { from: location } });
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
            <form name="login" onSubmit={handleSubmit(onFinish)}>
              <div className="mb-3">
                <Input
                  name="email"
                  type="text"
                  className="form-control"
                  aria-describedby="email"
                  placeholder="E-mail"
                  icon={<IconUser />}
                  {...register('email', {
                    required: errorMessages.requried,
                    pattern: {
                      value: emailPattern,
                      message: errorMessages.emailPattern
                    }
                  })}
                  errors={errors}
                />
              </div>
              <div>
                <Input
                  name="password"
                  type="password"
                  className="form-control"
                  aria-describedby="password"
                  placeholder="Senha"
                  icon={<IconPassword />}
                  {...register('password', {
                    required: errorMessages.required,
                    maxLength: {
                      value: 32,
                      message: errorMessages.passwordMaxLength
                    },
                    minLength: { value: 6, message: errorMessages.passwordMinLength }
                  })}
                  errors={errors}
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
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="btn btn-primary w-100 mt-5 fw-bold">
                  Entrar
                </Button>
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
