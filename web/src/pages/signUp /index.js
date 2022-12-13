import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { ReactComponent as IconName } from '../../images/name_icon.svg';
import { ReactComponent as IconCpf } from '../../images/badge.svg';
import { ReactComponent as IconPassowrd } from '../../images/password.svg';

import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import HomeSidebar from '../../components/homeSidebar';
import { NavLink } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { Input, Button, emailPattern, errorMessages } from '../../components/form/inputs';
import { formatCpf, unformatCpf } from '../../utils';

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  const onFinish = async (values) => {
    values.username = values.cpf;

    await apiRequest('login', 'login/v0/user/signup', 'post', values)
      .then(async (response) => {
        if (response.ok) {
          alertMessage('success', 'Você recebeu um email para confirmar sua conta!');
        } else {
          alertMessage('error', null);
        }
      })
      .catch(() => {
        alertMessage('error', null);
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
            <form name="forgot_password" onSubmit={handleSubmit(onFinish)}>
              <div className="mb-4">
                <Input
                  name="name"
                  type="text"
                  className="form-control"
                  aria-describedby="name"
                  placeholder="Nome completo"
                  icon={<IconName />}
                  {...register('name', { required: errorMessages.required })}
                  errors={errors}
                />
              </div>
              <div className="mb-4">
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
              <div className="mb-4">
                <Input
                  name="email_confirmation"
                  type="text"
                  className="form-control"
                  aria-describedby="email_confirmation"
                  placeholder="Confirme seu email"
                  icon={<IconEmail />}
                  {...register('email_confirmation', {
                    validate: (val) => {
                      if (watch('email') != val) {
                        return errorMessages.emailConfirmation;
                      }
                    }
                  })}
                  errors={errors}
                />
              </div>
              <div className="mb-4">
                <Input
                  name="cpf"
                  type="text"
                  className="form-control"
                  aria-describedby="cpf"
                  placeholder="CPF"
                  icon={<IconCpf />}
                  {...register('cpf', {
                    required: errorMessages.required,
                    validate: (val) => {
                      if (!val || val.length !== 11) {
                        return errorMessages.cpf;
                      }
                    },
                    setValueAs: (v) => unformatCpf(v),
                    onChange: (e) => setValue('cpf', formatCpf(e.target.value))
                  })}
                  errors={errors}
                />
              </div>
              <div className="mb-4">
                <Input
                  name="password"
                  type="password"
                  className="form-control"
                  aria-describedby="password"
                  placeholder="Senha"
                  icon={<IconPassowrd />}
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
              <div>
                <Input
                  name="password_confirmation"
                  type="password"
                  className="form-control"
                  aria-describedby="password_confirmation"
                  placeholder="Confirme sua senha"
                  icon={<IconPassowrd />}
                  {...register('password_confirmation', {
                    validate: (val) => {
                      if (watch('password') != val) {
                        return errorMessages.passwordConfirmation;
                      }
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
