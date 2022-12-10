import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import alertMessage from '../alertMessage';
import store from './store';

export default function Form({ children, onFinish, ...props }) {
  const form = useRef(null);

  useEffect(() => {
    store.dispatch({ type: 'SET_FORM_NAME', value: props.name });
  });

  function isValid() {
    const items = store.getState().inputs;

    for (let item in items) {
      if (items[item].errors.length > 0) return false;
    }

    return true;
  }

  const onSubmit = (event) => {
    event.preventDefault();

    store.dispatch({ type: 'START_SUBMITTING' });

    if (isValid()) {
      const values = Object.fromEntries(new FormData(event.target));
      onFinish(values);
    } else {
      alertMessage('error', 'Por favor, verifique os erros no formulário');
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
