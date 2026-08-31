const decode = require('jwt-decode');
const expressJwt = require('express-jwt');
const tools = require('auth0-extension-tools');
const conditional = require('express-conditional-middleware');

module.exports = function(options) {
  if (!options || typeof options !== 'object') {
    throw new tools.ArgumentError('Must provide the options');
  }

  if (options.secret === null || options.secret === undefined) {
    throw new tools.ArgumentError('Must provide a valid secret');
  }

  if (typeof options.secret !== 'string' || options.secret.length === 0) {
    throw new tools.ArgumentError('The provided secret is invalid: ' + options.secret);
  }

  if (options.audience === null || options.audience === undefined) {
    throw new tools.ArgumentError('Must provide a valid secret');
  }

  if (typeof options.audience !== 'string' || options.audience.length === 0) {
    throw new tools.ArgumentError('The provided audience is invalid: ' + options.audience);
  }

  if (options.baseUrl === null || options.baseUrl === undefined) {
    throw new tools.ArgumentError('Must provide a valid base URL');
  }

  if (typeof options.baseUrl !== 'string' || options.baseUrl.length === 0) {
    throw new tools.ArgumentError('The provided base URL is invalid: ' + options.baseUrl);
  }

  const validateToken = expressJwt({
    audience: options.audience,
    issuer: options.baseUrl,
    secret: options.secret,
    algorithms: [ 'HS256' ],
    credentialsRequired: options.credentialsRequired || true
  });

  return function(req, res, next) {
    validateToken(req, res, function(err) {
      if (err) {
        return next(err);
      }

      if (options.onLoginSuccess) {
        return options.onLoginSuccess(req, res, next);
      }

      return next();
    });
  };
};

module.exports.optional = function(options) {
  const mw = module.exports(options);
  return conditional(
    function(req) {
      if (req && req.headers && req.headers.authorization && req.headers.authorization.indexOf('Bearer ') === 0) {
        try {
          const decodedToken = decode(req.headers.authorization.split(' ')[1]);
          return decodedToken && decodedToken.iss === options.baseUrl;
        } catch (ex) {
          return false;
        }
      }

      return false;
    },
    mw
  );
};
