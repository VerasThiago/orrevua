import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as IconBadge } from '../../../images/badge.svg';
import { ReactComponent as IconEmail } from '../../../images/alternate_email.svg';
import { ReactComponent as IconUser } from '../../../images/user.svg';
import { apiRequest } from '../../../services/api';
import alertMessage from '../../../components/alertMessage';
import Loading from '../../../components/loading';
import { formatCpf } from '../../../utils';
import InputIcon from '../../../components/inputIcon';

export default function AdminUserTickets() {
  const { userId } = useParams();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reloadTickets();
  }, []);

  const reloadTickets = () => {
    setLoading(true);
    apiRequest('login', `login/v0/user/${userId}`, 'get')
      .then(async (response) => {
        const parsedResponse = await response.json();
        if (response.ok) {
          setUser(parsedResponse.data);
        } else {
          if (parsedResponse.message) alertMessage('error', parsedResponse.message);
        }
      })
      .catch(() => {
        alertMessage('error', 'Ocorreu um erro inesperado');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinish = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target));
    values.ownerid = userId;

    apiRequest('api', 'api/v0/ticket/create', 'post', values)
      .then(async (response) => {
        if (response.ok) {
          alertMessage('success', 'Ingresso criado com sucesso!');
          event.target.reset();
        } else {
          alertMessage('error', 'Ocorreu um erro inesperado');
        }
      })
      .catch(() => {
        alertMessage('error', 'Ocorreu um erro inesperado');
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="vh-100 m-0 p-4">
      <p className="fs-2 mb-5">Criar ingresso</p>
      <p className="fs-4 mb-1">Despedida do Veras</p>
      <p>23 de Dezembro de 2022 - 18h</p>
      <div className="d-flex gap-3 justify-content-start mb-4">
        <div className="col-md-12 col-lg-6" style={{ maxWidth: '300px' }}>
          <p className="fs-4 mb-4">Conta do usuário</p>
          <InputIcon
            id="email"
            name="email"
            type="email"
            className="form-control rounded-pill p-3 bg-dark"
            aria-describedby="email"
            placeholder="E-mail"
            value={formatCpf(user.cpf)}
            readOnly
            icon={<IconBadge />}
          />
          <p className="fs-4 mt-4 mb-1">{user.name}</p>
          <p className="mb-1">{formatCpf(user.cpf)}</p>
          <p>{user.email}</p>
        </div>
        <div className="col-md-12 col-lg-6">
          <p className="fs-4 mb-4">Conta do usuário</p>
          <form id="new_ticket" onSubmit={onFinish} className="d-flex flex-column gap-4">
            <div style={{ maxWidth: '400px' }}>
              <InputIcon
                id="name"
                name="name"
                type="text"
                className="form-control rounded-pill p-3 bg-dark"
                aria-describedby="name"
                placeholder="Nome"
                icon={<IconUser />}
              />
            </div>
            <div style={{ maxWidth: '400px' }}>
              <InputIcon
                id="email"
                name="email"
                type="email"
                className="form-control rounded-pill p-3 bg-dark"
                aria-describedby="email"
                placeholder="E-mail"
                icon={<IconEmail />}
              />
            </div>
            <div style={{ maxWidth: '400px' }}>
              <InputIcon
                id="cpf"
                name="cpf"
                type="text"
                className="form-control rounded-pill p-3 bg-dark"
                aria-describedby="cpf"
                placeholder="CPF"
                icon={<IconBadge />}
              />
            </div>
            <div style={{ maxWidth: '400px' }}>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-3 mt-3 fw-bold">
                Criar ingresso
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
