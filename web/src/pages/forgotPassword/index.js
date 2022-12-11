import React from 'react';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import HomeSidebar from '../../components/homeSidebar';

import { useForm } from 'react-hook-form';
import { Input, Button, emailPattern } from '../../components/form/inputs';

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

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
            <form name="forgot_password" onSubmit={handleSubmit(onFinish)}>
              <div>
                <Input
                  name="email"
                  type="text"
                  className="form-control"
                  aria-describedby="email"
                  placeholder="E-mail"
                  icon={<IconEmail />}
                  {...register('email', {
                    required: 'Este campo é obrigatório',
                    pattern: {
                      value: emailPattern,
                      message: 'Insira um email válido'
                    }
                  })}
                  errors={errors}
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
