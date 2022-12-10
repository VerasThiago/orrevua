export const errorsMapping = {
  required: handleRequired,
  length: handleLength
};

function handleRequired(value) {
  let error = null;

  if (!value || value === '') {
    error = {
      type: 'required',
      message: 'Este campo é obrigatório'
    };
  }

  return error;
}

function handleLength(value, rule) {
  let error = null;

  if (value?.length < rule.min) {
    error = {
      type: 'length',
      message: `Este campo deve conter no mínimo ${rule.min} caracteres`
    };
  }

  if (value?.length > rule.max) {
    error = {
      type: 'length',
      message: `Este campo deve conter no máximo ${rule.max} caracteres`
    };
  }

  return error;
}
