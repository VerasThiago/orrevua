import { configureStore } from '@reduxjs/toolkit';

function formReducer(state = { formName: '', submitting: false, inputs: {} }, action) {
  if (action.type === 'SET_FORM_NAME') {
    return {
      ...state,
      formName: action.value
    };
  }
  if (action.type === 'START_SUBMITTING') {
    return {
      ...state,
      submitting: true
    };
  }
  if (action.type === 'STOP_SUBMITTING') {
    return {
      ...state,
      submitting: false
    };
  }
  if (action.type === 'ADD_INPUT') {
    return {
      ...state,
      inputs: { ...state.inputs, [action.name]: action.value }
    };
  }
  if (action.type === 'INPUT_RESET_ERRORS') {
    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.name]: {
          ...state.inputs[action.name],
          errors: []
        }
      }
    };
  }
  if (action.type === 'INPUT_ADD_ERROR') {
    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.name]: {
          ...state.inputs[action.name],
          errors: [...state.inputs[action.name].errors, action.value]
        }
      }
    };
  }
  return state;
}

export default configureStore({ reducer: formReducer });
