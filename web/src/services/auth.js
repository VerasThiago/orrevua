import { message } from 'antd';
import { useState } from 'react';
import { AuthContext } from '../App';
import { apiRequest } from './api';

const TOKEN_KEY = 'TICKETS-TOKEN';

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const refresh = async () => {
    setLoading(true);

    apiRequest('login', 'token/validate', 'post')
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
    const response = await apiRequest('login', 'login/v0/user/login', 'post', loginParams);
    const responseBody = await response.json();
    if (response.ok) {
      setToken(responseBody.token);
      setLoading(true);
      return true;
    } else {
      removeToken();
      if (responseBody.message) message.error(responseBody.message);
      return false;
    }
  };

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
  };

  const value = {
    loading,
    authenticated,
    refresh,
    login: handleLogin,
    logout: handleLogout
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
