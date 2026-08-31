const tools = require('auth0-extension-tools');

module.exports = function(domain, webtaskUrl, extensionSecret) {
  if (domain === null || domain === undefined) {
    throw new tools.ArgumentError('Must provide the domain');
  }

  if (typeof domain !== 'string' || domain.length === 0) {
    throw new tools.ArgumentError('The provided domain is invalid: ' + domain);
  }

  if (webtaskUrl === null || webtaskUrl === undefined) {
    throw new tools.ArgumentError('Must provide the webtaskUrl');
  }

  if (typeof webtaskUrl !== 'string' || webtaskUrl.length === 0) {
    throw new tools.ArgumentError('The provided webtaskUrl is invalid: ' + webtaskUrl);
  }

  if (extensionSecret === null || extensionSecret === undefined) {
    throw new tools.ArgumentError('Must provide the extensionSecret');
  }

  if (typeof extensionSecret !== 'string' || extensionSecret.length === 0) {
    throw new tools.ArgumentError('The provided extensionSecret is invalid: ' + extensionSecret);
  }

  return function(hookPath) {
    if (hookPath === null || hookPath === undefined) {
      throw new tools.ArgumentError('Must provide the hookPath');
    }

    if (typeof hookPath !== 'string' || hookPath.length === 0) {
      throw new tools.ArgumentError('The provided hookPath is invalid: ' + hookPath);
    }

    return function(req, res, next) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];

        try {
          if (tools.validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, token)) {
            return next();
          }
        } catch (e) {
          return next(e);
        }
      }

      return next(new tools.HookTokenError('Hook token missing for the call to: ' + hookPath));
    };
  };
};
