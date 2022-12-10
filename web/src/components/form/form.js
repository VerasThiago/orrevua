import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';

export default function Form({ children, onFinish, ...props }) {
  const form = useRef(null);

  useEffect(() => {
    store.dispatch({ type: 'SET_FORM_NAME', value: props.name });
  });

  function isValid() {
    const items = store.getState().inputs;
    let canSubmit = true;

    for (let item in items) {
      store.dispatch({ type: 'INPUT_HAS_VALIDATED', name: item });
      if (items[item].errors.length > 0 || items[item].hasValidated === false) {
        canSubmit = false;
      }
    }

    return canSubmit;
  }

  function unmaskedInputs() {
    const items = store.getState().inputs;
    const values = {};

    for (let item in items) {
      values[item] = items[item].unmaskedValue;
    }

    return values;
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    store.dispatch({ type: 'START_SUBMITTING' });

    if (isValid()) {
      await onFinish(unmaskedInputs());
    }

    store.dispatch({ type: 'STOP_SUBMITTING' });
  };

  return (
    <Provider store={store}>
      <form ref={form} id={props.name} onSubmit={onSubmit} {...props}>
        {children}
      </form>
    </Provider>
  );
}
