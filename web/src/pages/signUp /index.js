import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { ReactComponent as IconName } from '../../images/name_icon.svg';
import { ReactComponent as IconCpf } from '../../images/badge.svg';
import { ReactComponent as IconPassowrd } from '../../images/password.svg';

import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import HomeSidebar from '../../components/homeSidebar';
import { NavLink } from 'react-router-dom';
import Form from '../../components/form/form';
import FormItem from '../../components/form/formItem';
import FormButton from '../../components/form/formButton';

export default function SignUp() {
  const onFinish = async (values) => {
    values.username = values.cpf;

    await apiRequest('login', 'login/v0/user/signup', 'post', values)
      .then(async (response) => {
        if (response.ok) {
          alertMessage('success', 'Você recebeu um email para confirmar sua conta!');
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
            <p className="fs-2">Cadastrar</p>
          </div>
          <div>
            <p>Crie uma conta para garantir os seus ingressos</p>
          </div>
          <div>
            <Form name="forgot_password" onFinish={onFinish}>
              <div className="mb-4">
                <FormItem
                  name="name"
                  type="text"
                  className="form-control"
                  aria-describedby="name"
                  placeholder="Nome completo"
                  icon={<IconName />}
                  rules={[{ type: 'required' }]}
                />
              </div>
              <div className="mb-4">
                <FormItem
                  name="email"
                  type="email"
                  className="form-control"
                  aria-describedby="email"
                  placeholder="E-mail"
                  icon={<IconEmail />}
                  rules={[{ type: 'required' }]}
                />
              </div>
              <div className="mb-4">
                <FormItem
                  name="cpf"
                  type="text"
                  className="form-control"
                  aria-describedby="cpf"
                  placeholder="CPF"
                  icon={<IconCpf />}
                  rules={[{ type: 'required' }]}
                  mask="cpf"
                />
              </div>
              <div>
                <FormItem
                  name="password"
                  type="password"
                  className="form-control"
                  aria-describedby="password"
                  placeholder="Senha"
                  icon={<IconPassowrd />}
                  rules={[{ type: 'length', min: 6, max: 32 }]}
                />
              </div>

              <div>
                <FormButton type="submit" className="btn btn-primary w-100 mt-5 fw-bold">
                  Cadastrar
                </FormButton>
              </div>
            </Form>
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
