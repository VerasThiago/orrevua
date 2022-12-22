import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../../services/api';
import alertMessage from '../../../components/alertMessage';
import Loading from '../../../components/loading';
import Header from '../../../components/header';
import { ReactComponent as IconCpf } from '../../../images/badge.svg';

import { useForm } from 'react-hook-form';
import { Input, Button } from '../../../components/form/inputs';

export default function Validate() {
  const form = useForm();
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = form;

  const [loading, setLoading] = useState(false);
  const [statusImage, setStatusImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusMessageName, setStatusMessageName] = useState('');
  const [myTimeout, setMyTimeout] = useState(null);

  const statuses = {
    ok: {
      img: '/images/ok.png',
      message: 'Tudo certo, boa festa!'
    },
    error: {
      img: '/images/error.png',
      message: 'Ingresso inválido!'
    },
    alreadyUsed: {
      img: '/images/already_used.png',
      message: 'Ops, este ingresso já foi usado!'
    }
  };

  function resetStatus() {
    setStatusImage(null);
    setStatusMessage('');
    setStatusMessageName('');
    reset();
  }

  function setStatus(status, name, prepend = null) {
    setStatusImage(statuses[status].img);
    if (prepend) {
      setStatusMessage(statuses[status].message + ' ' + prepend);
    } else {
      setStatusMessage(statuses[status].message);
    }
    setStatusMessageName(name);
    clearTimeout(myTimeout);
    setMyTimeout(
      setTimeout(() => {
        resetStatus();
      }, 4000)
    );
  }

  function focusInput() {
    const input = document.getElementsByName('cpf');

    if (input && input.length > 0) {
      input[0].focus();
    }
  }

  useEffect(() => {
    focusInput();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);

    await apiRequest('api', 'api/v0/ticket/validate', 'POST', { cpf: values.cpf })
      .then(async (response) => {
        const responseBody = await response.json();
        if (response.ok) {
          setStatus('ok', responseBody.name);
        } else if (responseBody && responseBody.error) {
          if (responseBody.error.type === 'DATA_NOT_FOUND') {
            setStatus('error', responseBody.name);
          } else if (responseBody.error.type === 'DATA_ALREADY_BEGIN_USED') {
            const time = new Date(responseBody.error.metaData.time).toLocaleString('pt-BR');
            setStatus('alreadyUsed', responseBody.name, time);
          }
        }
      })
      .catch(() => {
        alertMessage('error', null);
      })
      .finally(() => {
        setLoading(false);
        focusInput();
      });
  };

  return (
    <div>
      <Header title="Validar ingresso" />

      <div className="row justify-content-center gap-5">
        <form
          name="validate_ticket"
          className="d-flex justify-content-center gap-3"
          onSubmit={handleSubmit(onFinish)}>
          <div>
            <Input
              name="cpf"
              type="text"
              placeholder="CPF"
              icon={<IconCpf />}
              form={form}
              required
              mask="cpf"
            />
          </div>

          <div>
            <Button
              type="submit"
              loading={isSubmitting}
              className="btn btn-primary w-100 fw-bold px-4">
              Validar
            </Button>
          </div>
        </form>
        <div className="d-flex justify-content-center">
          {loading && <Loading />}
          {statusImage && !loading && (
            <div>
              <div className="fs-1 text-center fw-bold">{statusMessageName}</div>
              <div className="fs-1 text-center fw-bold">{statusMessage}</div>
              <img src={statusImage} alt="Validation status" className="img-fluid" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
