import React, { useContext } from 'react';
import './index.scss';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { AuthContext } from '../../App';
import HomeSidebar from '../../components/homeSidebar';

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
        <div className="col-md-6">
          <p className="login-title-forms fw-bold">Entrar</p>
        </div>
        <div className="col-md-6">
          <p className="login-greeting-forms fw-bold">
            Sentimos sua falta! Faça o login para começar
          </p>
        </div>
        <div className="col-md-6">
          <Form
            name="login"
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Email é obrigatório'
                },
                {
                  type: 'email',
                  message: 'Email deve ser um email válido'
                }
              ]}>
              <Input
                className="rounded-pill p-3"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="E-mail"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Senha é obrigatória'
                },
                {
                  min: 6,
                  message: 'Senha deve conter pelo menos 6 caracteres'
                }
              ]}>
              <Input
                className="rounded-pill p-3"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Senha"
              />
            </Form.Item>
            <div className="d-flex justify-content-end pb-5">
              <NavLink
                to={'/forgot_password'}
                className="login-forgot-password fw-bold text-decoration-none">
                Esqueceu a senha?
              </NavLink>
            </div>
            <Form.Item>
              <button type="submit" className="btn btn-primary w-100 rounded-pill py-3">
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
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
