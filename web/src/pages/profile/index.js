import React, { useState, useContext } from 'react';
import { AuthContext } from '../../App';
import Header from '../../components/header';
import { InputIcon } from '../../components/form/inputs';
import { ReactComponent as IconBadge } from '../../images/badge.svg';
import { ReactComponent as IconEmail } from '../../images/alternate_email.svg';
import { ReactComponent as IconUser } from '../../images/user.svg';
import { ReactComponent as IconVisibilityPassword } from '../../images/visibility_off.svg';
import { formatCpf, formatEmail } from '../../utils';

import { useForm } from 'react-hook-form';
import { Input, Button, errorMessages } from '../../components/form/inputs';

export default function Profile() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const { userData } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const onFinish = async (values) => {
    console.log(values);
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

          <form name="forgot_password" className="row gap-3" onSubmit={handleSubmit(onFinish)}>
            <div className="col-12">
              <Input
                name="password"
                type={showPw ? 'text' : 'password'}
                className="form-control"
                aria-describedby="password"
                placeholder="Nova senha"
                icon={<IconVisibilityPassword onClick={toggleShowPassword} />}
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
            <div className="col-12">
              <Input
                name="password_confirmation"
                type={showConfirmPw ? 'text' : 'password'}
                className="form-control"
                aria-describedby="password_confirmation"
                placeholder="Confirme sua senha"
                icon={<IconVisibilityPassword onClick={toggleShowConfirmPassword} />}
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
