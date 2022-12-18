import React, { useState, useContext } from 'react';
import { AuthContext } from '../../App';
import Header from '../../components/header';
import { InputIcon } from '../../components/form/inputs';
import { ReactComponent as IconBadge } from '../../images/badge.svg';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { ReactComponent as IconUser } from '../../images/user.svg';
import { ReactComponent as IconVisibilityPassword } from '../../images/visibility_off.svg';
import { formatCpf } from '../../utils';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';

import { useForm } from 'react-hook-form';
import { Input, Button, errorMessages } from '../../components/form/inputs';

export default function Profile() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const { userData } = useContext(AuthContext);

  const form = useForm();
  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting }
  } = form;

  const onFinish = async (values) => {
    await apiRequest('login', 'login/v0/user/password/update', 'PATCH', {
      password: values.password
    })
      .then(async (response) => {
        const responseBody = await response.json();
        if (response.ok) {
          reset();
          alertMessage('success', 'Sua senha foi alterada!');
        } else {
          alertMessage('error', responseBody.error);
        }
      })
      .catch(() => {
        alertMessage('error', null);
      });
  };

  const toggleShowPassword = () => {
    setShowPw(!showPw);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPw(!showConfirmPw);
  };

  return (
    <div>
      <Header title="Perfil" subTitle="Confira se seus dados estão corretos" />

      <div className="row gap-4 gap-lg-0">
        <div className="col-12 col-lg-6">
          <div className="fs-4 mb-3">Seus dados</div>
          <div className="row gap-3">
            <div className="col-12">
              <InputIcon icon={<IconUser />}>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  aria-describedby="name"
                  placeholder="CPF"
                  value={userData().User.name}
                  readOnly
                />
              </InputIcon>
            </div>
            <div className="col-12">
              <InputIcon icon={<IconEmail />}>
                <input
                  name="email"
                  type="text"
                  className="form-control"
                  aria-describedby="email"
                  placeholder="CPF"
                  value={userData().User.email}
                  readOnly
                />
              </InputIcon>
            </div>
            <div className="col-12">
              <InputIcon icon={<IconBadge />}>
                <input
                  name="cpf"
                  type="text"
                  className="form-control"
                  aria-describedby="cpf"
                  placeholder="CPF"
                  value={formatCpf(userData().User.cpf)}
                  readOnly
                />
              </InputIcon>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="fs-4 mb-3">Trocar senha</div>

          <form name="change_password" className="row gap-3" onSubmit={handleSubmit(onFinish)}>
            <div className="col-12">
              <Input
                name="password"
                type={showPw ? 'text' : 'password'}
                placeholder="Nova senha"
                icon={<IconVisibilityPassword onClick={toggleShowPassword} />}
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
            <div className="col-12">
              <Input
                name="password_confirmation"
                type={showConfirmPw ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                icon={<IconVisibilityPassword onClick={toggleShowConfirmPassword} />}
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

            <div className="col-12">
              <Button
                type="submit"
                loading={isSubmitting}
                className="btn btn-primary w-100 fw-bold">
                Salvar senha
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
