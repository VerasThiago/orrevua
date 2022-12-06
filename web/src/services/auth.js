import { useState } from 'react';
import alertMessage from '../components/alertMessage';
import { AuthContext } from '../App';
import { apiRequest } from './api';
import { parseJwt } from '../utils/index';

const TOKEN_KEY = 'TICKETS-TOKEN';

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const refresh = async () => {
    setLoading(true);

    apiRequest('login', 'login/v0/user/token/validate', 'post', { token: getToken() })
      .then(async (response) => {
        if (response.status === 200) {
          const json = await response.json();
          setToken(json.token);
          setAuthenticated(true);
        } else {
          removeToken();
          setAuthenticated(false);
        }
      })
      .catch(() => {
        removeToken();
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogin = async (loginParams) => {
    const response = await apiRequest('login', 'login/v0/user/signin', 'post', loginParams);
    const responseBody = await response.json();
    if (response.ok) {
      setToken(responseBody.token);
      setLoading(true);
      return true;
    } else {
      removeToken();
      if (responseBody.message) alertMessage('error', responseBody.message);
      return false;
    }
  };

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
  };

  const userData = () => {
    const token = getToken();

    if (token) return parseJwt(getToken());
    else return null;
  };

  const value = {
    loading,
    authenticated,
    refresh,
    login: handleLogin,
    logout: handleLogout,
    userData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function generateAuthHeader() {
  return { Authorization: getToken() };
}

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}
