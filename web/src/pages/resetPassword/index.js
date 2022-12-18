import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as IconVisibilityPassword } from '../../images/visibility_off.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';

import { useForm } from 'react-hook-form';
import { Input, Button, errorMessages } from '../../components/form/inputs';

export default function ResetPassword() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [userToken, setUserToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm();
  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting }
  } = form;

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
        const responseBody = await response.json();
        if (response.ok) {
          reset();
          const message = (
            <div>
              <span>
                Sua senha foi alterada. Vou será redirecionado para o login em breve. Ou clique{' '}
                <a href="/login">aqui</a> para ir agora.
              </span>
            </div>
          );
          alertMessage('success', message);
          setTimeout(() => {
            navigate('/login', { replace: true, state: { from: location } });
          }, 4000);
        } else {
          alertMessage('error', responseBody.error);
        }
      })
      .catch(() => {
        alertMessage('error', null);
      });
  };

  return (
    <div className="row h-100 m-0">
      <div className="bg-secondary d-flex flex-column align-items-center justify-content-lg-center pt-3 pt-lg-0">
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
              <div>
                <Input
                  name="password_confirmation"
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  icon={<IconVisibilityPassword onClick={toggleShowConfirmPassword} />}
                  form={form}
                  required
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
