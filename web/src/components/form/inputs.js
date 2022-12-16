import React from 'react';
import { formatCpf, unformatCpf } from '../../utils';

export const emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const errorMessages = {
  required: 'Este campo é obrigatório',
  emailPattern: 'Insira um email válido',
  passwordMinLength: 'Sua senha deve conter no mínimo 6 caracteres',
  passwordMaxLength: 'Sua senha pode conter no máximo 32 caracteres',
  passwordConfirmation: 'As senhas devem ser iguais',
  emailConfirmation: 'Os emails devem ser iguais',
  cpf: 'Não é um CPF válido'
};

function setMasks(registerProps, mask, setValue, props) {
  if (mask === 'cpf') {
    registerProps = {
      ...registerProps,
      validate: (val) => {
        if (!val || val.length !== 11) {
          return errorMessages.cpf;
        }
      },
      setValueAs: (v) => unformatCpf(v),
      onChange: (e) => setValue(props.name, formatCpf(e.target.value))
    };
  } else if (mask === 'email') {
    registerProps = {
      ...registerProps,
      pattern: {
        value: emailPattern,
        message: errorMessages.emailPattern
      },
      setValueAs: (v) => v.toLowerCase(),
      onChange: (e) => setValue(props.name, e.target.value.toLowerCase())
    };
  }

  return registerProps;
}

export const Input = ({ icon, form, registerProps = {}, mask, required, ...props }) => {
  function renderErrors(errors, name) {
    if (errors && errors[name]) {
      return <span className="text-danger fs-6 ps-3">{errors[name].message}</span>;
    }
  }

  const {
    register,
    setValue,
    formState: { errors }
  } = form;

  registerProps = setMasks(registerProps, mask, setValue, props);

  if (required) registerProps = { ...registerProps, required: errorMessages.required };

  return (
    <div>
      <InputIcon icon={icon}>
        <input
          {...props}
          aria-describedby={props.name}
          aria-invalid={errors[props.name] ? 'true' : 'false'}
          className={
            'form-control ' +
            (errors[props.name] ? props.className + ' border-danger' : props.className)
          }
          style={icon && { paddingRight: '3.1rem' }}
          {...register(props.name, registerProps)}
        />
      </InputIcon>
      {renderErrors(errors, props.name)}
    </div>
  );
};

export function InputIcon({ icon, children }) {
  if (!icon) return children;

  const updatedIcon = React.cloneElement(icon, {
    style: { ...icon.props.style, position: 'absolute', right: '1.5rem', bottom: '1.15rem' }
  });

  return (
    <div style={{ position: 'relative' }}>
      {children}
      {updatedIcon}
    </div>
  );
}

export function Button({ loading, children, ...props }) {
  if (loading)
    return (
      <button disabled {...props}>
        <div className="d-flex justify-content-center align-items-center gap-2">
          <div className="spinner-border spinner-border-sm" role="status"></div>
          <span>{children}</span>
        </div>
      </button>
    );

  return <button {...props}>{children}</button>;
}
