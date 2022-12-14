import React from 'react';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';

import { useForm } from 'react-hook-form';
import { Input, Button, emailPattern, errorMessages } from '../../components/form/inputs';

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
                  className="form-control"
                  aria-describedby="email"
                  placeholder="E-mail"
                  icon={<IconEmail />}
                  {...register('email', {
                    required: errorMessages.required,
                    pattern: {
                      value: emailPattern,
                      message: errorMessages.emailPattern
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
