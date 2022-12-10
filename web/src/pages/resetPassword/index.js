import React, { useState, useEffect } from 'react';
import { ReactComponent as IconVisibilityPassword } from '../../images/visibility_off.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import HomeSidebar from '../../components/homeSidebar';
import Form from '../../components/form/form';
import FormItem from '../../components/form/formItem';
import FormButton from '../../components/form/formButton';

export default function ResetPassword() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [userToken, setUserToken] = useState('');

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
            <p className="fs-2">Crie uma nova senha</p>
          </div>
          <div>
            <p>
              Crie uma senha de no minímo 6 digitos. Por segurança, considere usar números, letras
              maiúsculas e caracteres especiais (*@&ˆ%$#).
            </p>
          </div>
          <div>
            <Form name="forgot_password" onFinish={onFinish}>
              <div className="mb-4">
                <FormItem
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  className="form-control"
                  aria-describedby="password"
                  placeholder="Nova senha"
                  icon={<IconVisibilityPassword onClick={toggleShowPassword} />}
                  rules={[{ type: 'required' }]}
                />
              </div>
              <div>
                <FormItem
                  name="confirmPassword"
                  type={showConfirmPw ? 'text' : 'password'}
                  className="form-control"
                  aria-describedby="confirm-password"
                  placeholder="Confirme nova senha"
                  icon={<IconVisibilityPassword onClick={toggleShowConfirmPassword} />}
                  rules={[{ type: 'required' }]}
                />
              </div>

              <div>
                <FormButton type="submit" className="btn btn-primary w-100 mt-5 fw-bold">
                  Salvar senha
                </FormButton>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
