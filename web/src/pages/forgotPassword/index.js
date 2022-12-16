import React from 'react';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';

import { useForm } from 'react-hook-form';
import { Input, Button } from '../../components/form/inputs';

export default function ForgotPassword() {
  const form = useForm();
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = form;

  const onFinish = async (values) => {
    await apiRequest('login', 'login/v0/user/password/forget', 'post', values)
      .then(async (response) => {
        if (response.ok) {
          reset();
          alertMessage('success', 'Você recebeu um email com instruções para trocar sua senha');
        } else {
          alertMessage('error', null);
        }
      })
      .catch(() => {
        alertMessage('error', null);
      });
  };

  return (
    <div className="row h-100 m-0 p-0">
      <div className="bg-secondary d-flex flex-column align-items-center justify-content-lg-center pt-3 pt-lg-0">
        <div className="px-4" style={{ maxWidth: '450px' }}>
          <div>
            <p className="fs-2">Esqueceu sua senha?</p>
          </div>
          <div>
            <p>Informe seu e-mail e enviaremos instruções para você criar sua nova senha.</p>
          </div>
          <div>
            <form name="forgot_password" onSubmit={handleSubmit(onFinish)}>
              <div>
                <Input
                  name="email"
                  type="text"
                  mask="email"
                  placeholder="E-mail"
                  icon={<IconEmail />}
                  form={form}
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="btn btn-primary w-100 mt-5 fw-bold">
                  Enviar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
