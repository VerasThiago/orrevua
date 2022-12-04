import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { AuthContext } from '../../App';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const onFinish = async (values) => {
    const result = await login(values);
    if (result) navigate('/tickets', { replace: true, state: { from: location } });
  };

  return (
    <div className="vh-100">
      <h1 className="text-primary fw-bold pt-5 text-center">Entrar</h1>
      <p className="text-primary text-center">Sentimos sua falta! Faça o login para começar</p>
      <div className="d-flex justify-content-center">
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
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Senha é obrigatória'
              },
              {
                min: 3,
                message: 'Senha deve conter pelo menos 6 caracteres'
              }
            ]}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-100">
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
          <a href="">Forgot password</a>
        </Form>
      </div>
    </div>
  );
}
