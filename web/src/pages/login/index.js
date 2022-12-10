import React, { useContext } from 'react';
import './index.scss';
import { ReactComponent as IconUser } from '../../images/user.svg';
import { ReactComponent as IconPassword } from '../../images/password.svg';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { AuthContext } from '../../App';
import HomeSidebar from '../../components/homeSidebar';
import Form from '../../components/form/form';
import FormItem from '../../components/form/formItem';
import FormButton from '../../components/form/formButton';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

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
            <Form name="login" onFinish={onFinish}>
              <div className="mb-3">
                <FormItem
                  name="email"
                  type="email"
                  className="form-control"
                  aria-describedby="email"
                  placeholder="E-mail"
                  icon={<IconUser />}
                  rules={[{ type: 'required' }]}
                />
              </div>
              <div>
                <FormItem
                  name="password"
                  type="password"
                  className="form-control"
                  aria-describedby="password"
                  placeholder="Senha"
                  icon={<IconPassword />}
                  rules={[{ type: 'length', min: 6, max: 32 }]}
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
                <FormButton type="submit" className="btn btn-primary w-100 mt-5 fw-bold">
                  Entrar
                </FormButton>
                <div className="d-flex justify-content-center p-5">
                  <p className="login-signup-forms">
                    Não tem conta?
                    <NavLink to={'/signup'} className="mx-2 text-decoration-none fw-bold">
                      Cadastre-se
                    </NavLink>
                  </p>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
