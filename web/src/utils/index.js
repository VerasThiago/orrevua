export function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export function formatCpf(cpf) {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

export function unformatCpf(cpf) {
  return cpf.split('.').join('').replace('-', '');
}

const errorMessagesMapping = {
  'User not found': 'Usuário não encontrado',
  'Ticket not found': 'Ingresso não encontrado',
  'Email not found': 'Email não encontrado',
  'Invalid password': 'Senha inválida',
  'Unverified account': 'Conta não verificada',
  "There was an error regenerating. We've been notified and will look into it!":
    'Ocorreu um erro. Nós fomos notificados e vamos trabalhar para corrigí-lo!',
  'Data is already being used': 'Esses dados já estão em uso'
};

export function parseErrorMessage(message) {
  return errorMessagesMapping[message] || message || 'Ocorreu um erro inesperado';
}
