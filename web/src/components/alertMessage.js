import { toast } from 'react-toastify';
import { parseErrorMessage } from '../utils';

export default function alertMessage(type, message) {
  const parsedMessage = parseErrorMessage(message);

  toast[type](parsedMessage, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light'
  });
}
