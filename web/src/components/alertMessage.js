import { toast } from 'react-toastify';
import { parseErrorMessage } from '../utils/errors';

export default function alertMessage(type, message) {
  toast[type](parseErrorMessage(message), {
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
