import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../../services/api';
import TableUsers from './TableUsers';
import alertMessage from '../../../components/alertMessage';
import Loading from '../../../components/loading';
import Header from '../../../components/header';

export default function Users() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const keys = ['name', 'cpf', 'email'];

  useEffect(() => {
    setLoading(true);
    apiRequest('login', 'login/v0/user/list', 'get')
      .then(async (response) => {
        const dataUsers = await response.json();
        if (response.ok) {
          setData(dataUsers.data);
        } else {
          if (dataUsers.message) alertMessage('error', dataUsers.message);
        }
      })
      .catch(() => {
        console.log('error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  if (loading) {
    return <Loading />;
  }
  if (!data) {
    return <h1>Error</h1>;
  }
  return (
    <div>
      <Header title="Usuários" />

      <div className="form-group">
        <div className="input-group w-25 mx-5">
          <input
            className="rounded-pill form-control "
            type="text"
            placeholder="Buscar nome, e-mail ou cpf"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="m-5">
        <TableUsers data={search(data)} />
      </div>
    </div>
  );
}
