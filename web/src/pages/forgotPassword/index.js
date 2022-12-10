import React from 'react';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import HomeSidebar from '../../components/homeSidebar';
import Form from '../../components/form/form';
import FormItem from '../../components/form/formItem';
import FormButton from '../../components/form/formButton';

export default function ForgotPassword() {
  const onFinish = async (values) => {
    await apiRequest('login', 'login/v0/user/password/forget', 'post', values)
      .then(async (response) => {
        if (response.ok) {
          alertMessage('success', 'Você recebeu um email com instruções para trocar sua senha');
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
            <Form name="forgot_password" onFinish={onFinish}>
              <div>
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

              <div>
                <FormButton type="submit" className="btn btn-primary w-100 mt-5 fw-bold">
                  Enviar
                </FormButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
