import { generateAuthHeader } from './auth';

const SERVICE_URLS = {
  api: process.env.REACT_APP_API_URL,
  login: process.env.REACT_APP_LOGIN_URL
};

export const apiRequest = async (service, endpoint, method, body = {}, headers = {}) => {
  if (method === 'get') {
    body = null;
    headers = {};
  } else {
    headers = {
      'Content-Type': 'application/json',
      ...generateAuthHeader(),
      ...headers
    };
  }

  return fetch(SERVICE_URLS[service] + endpoint, {
    method: method,
    headers: { ...generateAuthHeader(), ...headers },
    body: body ? JSON.stringify(body) : null
  });
};
