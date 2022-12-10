import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as IconBadge } from '../../../images/badge.svg';
import { ReactComponent as IconEmail } from '../../../images/alternate_email.svg';
import { ReactComponent as IconUser } from '../../../images/user.svg';
import { apiRequest } from '../../../services/api';
import alertMessage from '../../../components/alertMessage';
import Loading from '../../../components/loading';
import { formatCpf, unformatCpf } from '../../../utils';
import InputIcon from '../../../components/inputIcon';
import Header from '../../../components/header';

import { useForm } from 'react-hook-form';
import { Input, Button } from '../../../components/form/inputs';

export default function AdminUserTickets() {
  const { userId } = useParams();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

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

  const onFinish = async (values) => {
    values.ownerid = userId;

    await apiRequest('api', 'api/v0/ticket/create', 'post', values)
      .then(async (response) => {
        const parsedResponse = await response.json();
        if (response.ok) {
          alertMessage('success', 'Ingresso criado com sucesso!');
        } else {
          if (parsedResponse.message) alertMessage('error', parsedResponse.message);
          else alertMessage('error', 'Ocorreu um erro inesperado');
        }
      })
      .catch(() => {
        alertMessage('error', 'Ocorreu um erro inesperado');
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
          <InputIcon
            name="show_cpf"
            type="text"
            className="form-control"
            aria-describedby="show_cpf"
            placeholder="CPF"
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
          <form
            name="new_ticket"
            onSubmit={handleSubmit(onFinish)}
            className="d-flex flex-column gap-4">
            <div style={{ maxWidth: '400px' }}>
              <Input
                name="name"
                type="text"
                className="form-control"
                aria-describedby="name"
                placeholder="Nome"
                icon={<IconUser />}
                {...register('name', { required: 'Este campo é obrigatório' })}
                errors={errors}
              />
            </div>
            <div style={{ maxWidth: '400px' }}>
              <Input
                name="email"
                type="email"
                className="form-control"
                aria-describedby="email"
                placeholder="E-mail"
                icon={<IconEmail />}
                {...register('email', { required: 'Este campo é obrigatório' })}
                errors={errors}
              />
            </div>
            <div style={{ maxWidth: '400px' }}>
              <Input
                name="cpf"
                type="text"
                className="form-control"
                aria-describedby="cpf"
                placeholder="CPF"
                icon={<IconBadge />}
                {...register('cpf', {
                  required: 'Este campo é obrigatório',
                  setValueAs: (v) => unformatCpf(v),
                  onChange: (e) => setValue('cpf', formatCpf(e.target.value))
                })}
                errors={errors}
              />
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
