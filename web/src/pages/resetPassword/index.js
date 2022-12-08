import React, { useState, useEffect } from 'react';
import { ReactComponent as IconVisibilityPassword } from '../../images/visibility_off.svg';
import { apiRequest } from '../../services/api';
import alertMessage from '../../components/alertMessage';
import InputIcon from '../../components/inputIcon';
import HomeSidebar from '../../components/homeSidebar';

export default function ResetPassword() {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
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

  const handleChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value
    });
  };

  const toggleShowPassword = () => {
    setShowPw(!showPw);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPw(!showConfirmPw);
  };

  const onFinish = async (event) => {
    event.preventDefault();
    if (formData.password === '') {
      alertMessage('error', 'Insira uma senha!');
    } else if (formData.password.length < 6) {
      alertMessage('error', 'Sua senha deve ter no mínimo 6 caracteres');
    } else if (formData.confirmPassword === '') {
      alertMessage('error', 'Confirme sua senha!');
    } else if (formData.password != formData.confirmPassword) {
      alertMessage('error', 'As senhas devem ser iguais!');
    } else {
      apiRequest(
        'login',
        'login/v0/user/password/update',
        'PATCH',
        { password: formData.password },
        { Authorization: userToken }
      )
        .then(async (response) => {
          if (response.ok) {
            alertMessage('success', 'Senha configurada com sucesso');
            event.target.reset();
          } else {
            alertMessage('error', 'Ocorreu um erro inesperado');
          }
        })
        .catch(() => {
          alertMessage('error', 'Ocorreu um erro inesperado');
        });
    }
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
            <form id="forgot_password" onSubmit={onFinish}>
              <div className="mb-4">
                <InputIcon
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  className="form-control rounded-pill p-3 bg-dark"
                  aria-describedby="password"
                  placeholder="Nova senha"
                  onChange={handleChange}
                  icon={<IconVisibilityPassword onClick={toggleShowPassword} />}
                />
              </div>
              <div>
                <InputIcon
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPw ? 'text' : 'password'}
                  className="form-control rounded-pill p-3 bg-dark"
                  aria-describedby="confirm-password"
                  placeholder="Confirme nova senha"
                  onChange={handleChange}
                  icon={<IconVisibilityPassword onClick={toggleShowConfirmPassword} />}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-3 mt-5 fw-bold">
                  Salvar senha
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
