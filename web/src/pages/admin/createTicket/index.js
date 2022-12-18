import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as IconBadge } from '../../../images/badge.svg';
import { ReactComponent as IconEmail } from '../../../images/alternate_email.svg';
import { ReactComponent as IconUser } from '../../../images/user.svg';
import { apiRequest } from '../../../services/api';
import alertMessage from '../../../components/alertMessage';
import Loading from '../../../components/loading';
import { formatCpf } from '../../../utils';
import Header from '../../../components/header';

import { useForm } from 'react-hook-form';
import { Input, InputIcon, Button } from '../../../components/form/inputs';

export default function AdminUserTickets() {
  const { userId } = useParams();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfos, setShowInfos] = useState(true);

  const form = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting }
  } = form;

  useEffect(() => {
    reloadTickets();
  }, []);

  const setFormsValues = () => {
    form.setValue('name', user.name);
    form.setValue('email', user.email);
    form.setValue('cpf', formatCpf(user.cpf));
  };

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      if (showInfos === false) {
        form.reset();
      } else {
        setFormsValues();
      }
    }
  }, [showInfos]);

  const handleChange = () => {
    setShowInfos(!showInfos);
  };

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormsValues();
    }
  }, [user]);

  const reloadTickets = () => {
    setLoading(true);
    apiRequest('login', `login/v0/user/${userId}`, 'get')
      .then(async (response) => {
        const responseBody = await response.json();
        if (response.ok) {
          setUser(responseBody.data);
        } else {
          alertMessage('error', responseBody.error);
        }
      })
      .catch(() => {
        alertMessage('error', null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinish = async (values) => {
    values.ownerid = userId;

    await apiRequest('api', 'api/v0/ticket/create', 'post', values)
      .then(async (response) => {
        const responseBody = await response.json();
        if (response.ok) {
          alertMessage('success', 'Ingresso criado com sucesso!');
        } else {
          alertMessage('error', responseBody.error);
        }
      })
      .catch(() => {
        alertMessage('error', null);
      });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Header title="Criar ingresso" />

      <p className="fs-4 mb-1">Despedida do Veras</p>
      <p>23 de Dezembro de 2022 - 18h</p>
      <div className="d-flex row gap-3 justify-content-start mb-4">
        <div className="col-md-12 col-lg-6" style={{ maxWidth: '300px' }}>
          <p className="fs-4 mb-4">Conta do usuário</p>
          <InputIcon icon={<IconBadge />}>
            <input
              name="show_cpf"
              type="text"
              className="form-control"
              aria-describedby="show_cpf"
              placeholder="CPF"
              value={formatCpf(user.cpf)}
              readOnly
            />
          </InputIcon>
          <p className="fs-4 mt-4 mb-1">{user.name}</p>
          <p className="mb-1">{formatCpf(user.cpf)}</p>
          <p>{user.email}</p>
        </div>
        <div className="col-md-12 col-lg-6">
          <p className="fs-4 mb-4">Conta do usuário</p>
          <form
            name="new_ticket"
            onSubmit={handleSubmit(onFinish)}
            className="d-flex flex-column gap-4">
            <div style={{ maxWidth: '400px' }}>
              <Input
                name="name"
                type="text"
                placeholder="Nome"
                icon={<IconUser />}
                form={form}
                readOnly={showInfos}
                required
              />
            </div>
            <div style={{ maxWidth: '400px' }}>
              <Input
                name="email"
                type="text"
                mask="email"
                placeholder="E-mail"
                icon={<IconEmail />}
                form={form}
                readOnly={showInfos}
                required
              />
            </div>
            <div style={{ maxWidth: '400px' }}>
              <Input
                name="cpf"
                type="text"
                placeholder="CPF"
                icon={<IconBadge />}
                form={form}
                required
                readOnly={showInfos}
                mask="cpf"
              />
            </div>
            <div className="d-flex">
              <input
                className="align-self-start my-1 mx-2"
                type={'checkbox'}
                checked={showInfos}
                onChange={handleChange}
              />
              <p>Ingresso para esse usuário</p>
            </div>
            <div style={{ maxWidth: '400px' }}>
              <Button
                type="submit"
                loading={isSubmitting}
                className="btn btn-primary w-100 mt-3 fw-bold">
                Criar ingresso
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
