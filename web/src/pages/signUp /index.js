import { useState } from 'react';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { ReactComponent as IconName } from '../../images/name_icon.svg';
import { ReactComponent as IconCpf } from '../../images/badge.svg';
import { ReactComponent as IconPassowrd } from '../../images/password.svg';

import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import { NavLink } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { Input, Button, errorMessages } from '../../components/form/inputs';

export default function SignUp() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm();
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = form;

  const onFinish = async (values) => {
    await apiRequest('login', 'login/v0/user/signup', 'post', values)
      .then(async (response) => {
        const responseBody = await response.json();
        if (response.ok) {
          setSubmitted(true);
        } else {
          alertMessage('error', responseBody.error);
        }
      })
      .catch(() => {
        alertMessage('error', null);
      });
  };

  if (submitted) {
    return (
      <div className="row h-100 m-0">
        <div className="bg-secondary d-flex flex-column align-items-center justify-content-center justify-content-lg-center pt-3 pt-lg-0">
          <div className="px-4 text-center text-lg-start" style={{ maxWidth: '450px' }}>
            <div>
              <p className="fs-2">Sucesso!</p>
            </div>
            <div>
              <p>Você recebeu um email para confirmar sua conta</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row h-100 m-0">
      <div className="bg-secondary d-flex flex-column align-items-center justify-content-center justify-content-lg-center pt-3 pt-lg-0">
        <div className="px-4" style={{ maxWidth: '450px' }}>
          <div>
            <p className="fs-2">Cadastrar</p>
          </div>
          <div>
            <p>Crie uma conta para garantir os seus ingressos</p>
          </div>
          <div>
            <form name="forgot_password" onSubmit={handleSubmit(onFinish)}>
              <div className="mb-4">
                <Input
                  name="name"
                  type="text"
                  placeholder="Nome completo"
                  icon={<IconName />}
                  form={form}
                  required
                />
              </div>
              <div className="mb-4">
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
              <div className="mb-4">
                <Input
                  name="email_confirmation"
                  type="text"
                  placeholder="Confirme seu email"
                  icon={<IconEmail />}
                  form={form}
                  registerProps={{
                    validate: (val) => {
                      if (watch('email') != val) {
                        return errorMessages.emailConfirmation;
                      }
                    }
                  }}
                />
              </div>
              <div className="mb-4">
                <Input
                  name="cpf"
                  type="text"
                  placeholder="CPF"
                  icon={<IconCpf />}
                  form={form}
                  required
                  mask="cpf"
                />
              </div>
              <div className="mb-4">
                <Input
                  name="password"
                  type="password"
                  placeholder="Senha"
                  icon={<IconPassowrd />}
                  form={form}
                  required
                  registerProps={{
                    maxLength: {
                      value: 32,
                      message: errorMessages.passwordMaxLength
                    },
                    minLength: { value: 6, message: errorMessages.passwordMinLength }
                  }}
                />
              </div>
              <div>
                <Input
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirme sua senha"
                  icon={<IconPassowrd />}
                  form={form}
                  registerProps={{
                    validate: (val) => {
                      if (watch('password') != val) {
                        return errorMessages.passwordConfirmation;
                      }
                    }
                  }}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="btn btn-primary w-100 mt-5 fw-bold">
                  Cadastrar
                </Button>
              </div>
            </form>
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
