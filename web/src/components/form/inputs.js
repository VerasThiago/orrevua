import React from 'react';

export const emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef(({ icon, errors, ...props }, ref) => {
  function renderErrors(errors, name) {
    if (errors && errors[name]) {
      return <span className="text-danger fs-6 ps-3">{errors[name].message}</span>;
    }
  }

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <InputIcon icon={icon}>
          <input
            ref={ref}
            {...props}
            aria-invalid={errors[props.name] ? 'true' : 'false'}
            className={errors[props.name] ? props.className + ' border-danger' : props.className}
          />
        </InputIcon>
      </div>
      {renderErrors(errors, props.name)}
    </div>
  );
});

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
