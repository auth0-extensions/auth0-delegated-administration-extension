const decode = require('jwt-decode');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const tools = require('auth0-extension-tools');
const conditional = require('express-conditional-middleware');
const UnauthorizedError = require('auth0-extension-tools').UnauthorizedError;

module.exports = function(options) {
  if (!options || typeof options !== 'object') {
    throw new tools.ArgumentError('Must provide the options');
  }

  if (options.domain === null || options.domain === undefined) {
    throw new tools.ArgumentError('Must provide a valid domain');
  }

  if (typeof options.domain !== 'string' || options.domain.length === 0) {
    throw new tools.ArgumentError('The provided domain is invalid: ' + options.domain);
  }

  if (options.audience === null || options.audience === undefined) {
    throw new tools.ArgumentError('Must provide a valid audience');
  }

  if (typeof options.audience !== 'string' || options.audience.length === 0) {
    throw new tools.ArgumentError('The provided audience is invalid: ' + options.audience);
  }

  const validateToken = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://' + options.domain + '/.well-known/jwks.json',
      handleSigningKeyError: function(err, cb) {
        if (err instanceof jwksRsa.SigningKeyNotFoundError) {
          return cb(new UnauthorizedError('A token was provided with an invalid kid'));
        }

        return cb(err);
      }
    }),

    // Validate the audience and the issuer.
    audience: options.audience,
    issuer: 'https://' + options.domain + '/',
    algorithms: [ 'RS256' ],

    // Optionally require authentication
    credentialsRequired: (options && options.credentialsRequired) || true
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
          return decodedToken && decodedToken.iss === 'https://' + options.domain + '/';
        } catch (ex) {
          return false;
        }
      }

      return false;
    },
    mw
  );
};
