import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { errorsMapping } from './errors';
import { formatCpf, formatToRequestCpf } from '../../utils';

function FormItem({ dispatch, icon, rules = [], mask, inputs, formName, ...props }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const itemAttributes = {
      rules: rules,
      errors: [],
      hasValidated: false
    };

    dispatch({ type: 'ADD_INPUT', name: props.name, value: itemAttributes });
  }, []);

  useEffect(() => {
    if (inputs[props.name]?.hasValidated === true) {
      validateInput(value);
    }
  }, [inputs[props.name]?.hasValidated]);

  function validateRule(rule, value) {
    const error = errorsMapping[rule.type](value, rule);

    if (error) {
      dispatch({ type: 'INPUT_ADD_ERROR', name: props.name, value: error });
    }
  }

  function validateInput(value) {
    dispatch({ type: 'INPUT_RESET_ERRORS', name: props.name });
    const rules = inputs[props.name].rules;

    for (let rule of rules) {
      validateRule(rule, value);
    }

    dispatch({ type: 'INPUT_IS_VALIDATED', name: props.name });
  }

  function maskInput(value) {
    if (!mask || mask === '') return value;

    if (mask === 'cpf') {
      return formatCpf(value);
    }

    return value;
  }

  function unmaskInput(value) {
    if (!mask || mask === '') return value;

    if (mask === 'cpf') {
      return formatToRequestCpf(value);
    }

    return value;
  }

  function handleChange(event) {
    const value = maskInput(event.target.value);
    dispatch({ type: 'INPUT_SET_UNMASKED', name: props.name, value: unmaskInput(value) });
    setValue(value);
    validateInput(value);
    if (props.onChange) props.onChange(event);
  }

  function renderErrors() {
    return inputs[props.name]?.errors?.map((error, index) => {
      if (error.type === 'notValidated') return;

      return (
        <div key={index} className="ps-4 text-danger">
          <small>{error.message}</small>
        </div>
      );
    });
  }

  const inputId = `${formName}_${props.name}`;

  let child = <input id={inputId} value={value} {...props} onChange={handleChange} />;

  if (icon) {
    const updatedIcon = React.cloneElement(icon, {
      style: { position: 'absolute', right: '1.5rem', bottom: '1.15rem' }
    });

    child = (
      <div style={{ position: 'relative' }}>
        <input id={inputId} value={value} {...props} onChange={handleChange} />
        {updatedIcon}
      </div>
    );
  }

  return (
    <>
      {child}
      {renderErrors()}
    </>
  );
}

function mapStateToProps(state) {
  return {
    inputs: state.inputs,
    formName: state.formName
  };
}

export default connect(mapStateToProps)(FormItem);
