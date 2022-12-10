import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { errorsMapping } from './errors';

function FormItem({ dispatch, icon, rules = [], inputs, formName, ...props }) {
  useEffect(() => {
    const itemAttributes = {
      rules: rules,
      errors: []
    };

    dispatch({ type: 'ADD_INPUT', name: props.name, value: itemAttributes });
  }, []);

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
  }

  function handleChange(event) {
    validateInput(event.target.value);
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

  let child = <input id={inputId} {...props} onChange={handleChange} />;

  if (icon) {
    const updatedIcon = React.cloneElement(icon, {
      style: { position: 'absolute', right: '1.5rem', bottom: '1.15rem' }
    });

    child = (
      <div style={{ position: 'relative' }}>
        <input id={inputId} {...props} onChange={handleChange} />
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
