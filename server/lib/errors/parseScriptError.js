import { ValidationError } from 'auth0-extension-tools';

export default (err, name) => {
  const caughtError = new ValidationError(err.message || '');
  let stack = `${name}-script error`;

  if (err.stack) {
    stack = err.stack.replace(/SAFE_EVAL_\d+/, `${name}-script error`).replace('evalmachine.<anonymous>', 'line');
  }

  caughtError.stack = stack.split('\n').slice(0, 2).join(' ');

  return caughtError;
};

