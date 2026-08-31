const jwt = require('jsonwebtoken');
const HookTokenError = require('./errors').HookTokenError;

module.exports = function validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, hookToken) {
  if (!hookToken) {
    throw new HookTokenError('Hook token missing');
  }

  try {
    jwt.verify(hookToken, extensionSecret, {
      audience: webtaskUrl + hookPath,
      issuer: 'https://' + domain
    });
    return true;
  } catch (e) {
    throw new HookTokenError('Invalid hook token', e);
  }
};
