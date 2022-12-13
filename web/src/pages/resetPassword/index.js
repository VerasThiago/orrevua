import React, { useState, useEffect } from 'react';
import { ReactComponent as IconVisibilityPassword } from '../../images/visibility_off.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import HomeSidebar from '../../components/homeSidebar';

import { useForm } from 'react-hook-form';
import { Input, Button, errorMessages } from '../../components/form/inputs';

export default function ResetPassword() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [userToken, setUserToken] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    });
    let token = params.token;
    setUserToken(token);
  }, []);

  const toggleShowPassword = () => {
    setShowPw(!showPw);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPw(!showConfirmPw);
  };

  const onFinish = async (values) => {
    await apiRequest(
      'login',
      'login/v0/user/password/update',
      'PATCH',
      { password: values.password },
      { Authorization: userToken }
    )
      .then(async (response) => {
        if (response.ok) {
          alertMessage('success', 'Senha configurada com sucesso');
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
            <p className="fs-2">Crie uma nova senha</p>
          </div>
          <div>
            <p>
              Crie uma senha de no minímo 6 digitos. Por segurança, considere usar números, letras
              maiúsculas e caracteres especiais (*@&ˆ%$#).
            </p>
          </div>
          <div>
            <form name="forgot_password" onSubmit={handleSubmit(onFinish)}>
              <div className="mb-4">
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
              <div>
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

              <div>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="btn btn-primary w-100 mt-5 fw-bold">
                  Salvar senha
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
