import errors from './errors.json';

export function parseErrorMessage(error) {
  if (!error) {
    return errors['pt-BR']['messages']['GENERIC_ERROR'];
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error !== 'object' || !(error.type in errors['pt-BR']['messages'])) {
    return errors['pt-BR']['messages']['GENERIC_ERROR'];
  }

  let message = errors['pt-BR']['messages'][error.type];

  if (error.metaData?.variables) {
    message = replaceErrorVariables(message, error.metaData.variables);
  }

  return message[0].toUpperCase() + message.substring(1);
}

function replaceErrorVariables(originalMessage, variables) {
  let message = originalMessage;

  for (let variable of variables) {
    try {
      message = message.replace(/\{\{.*\}\}/, Object.searchPath(errors['pt-BR'], variable.path));
    } catch (_) {
      message = message = message.replace(/\{\{.*\}\}/, '{{missing_translation}}');
    }
  }

  return message;
}
