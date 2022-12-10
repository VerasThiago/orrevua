import { formatCpf, unformatCpf } from '../../utils';

export function maskInput(mask, value) {
  if (!mask || mask === '') return value;

  if (mask === 'cpf') {
    return formatCpf(value);
  }

  return value;
}

export function unmaskInput(mask, value) {
  if (!mask || mask === '') return value;

  if (mask === 'cpf') {
    return unformatCpf(value);
  }

  return value;
}
