const decode = require('jwt-decode');
const jwt = require('express-jwt').expressjwt;
const jwksRsa = require('jwks-rsa');
const tools = require('../../auth0-extension-tools');
const conditional = require('express-conditional-middleware');
const UnauthorizedError = require('../../auth0-extension-tools').UnauthorizedError;

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
    credentialsRequired: (options && options.credentialsRequired) || true,

    // express-jwt v8 attaches the decoded token to req.auth by default;
    // downstream code (managementApiClient, api routes) reads req.user.
    requestProperty: 'user'
  });

  return function(req, res, next) {
    validateToken(req, res, function(err) {
      if (err) {
        // TEMP DEBUG: blast the real (normally-swallowed) validation error into
        // the HTTP response so we can see it without webtask log access.
        return res.status(500).json({
          debug: 'authenticateUsers validateToken failed',
          name: err.name,
          message: err.message,
          code: err.code,
          inner: err.inner ? { name: err.inner.name, message: err.inner.message } : undefined,
          stack: err.stack
        });
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
  const expectedIss = 'https://' + options.domain + '/';
  return conditional(
    function(req) {
      // TEMP DEBUG: stash why the predicate decides so the fail handler below
      // can surface it via the API.
      if (!(req && req.headers && req.headers.authorization)) {
        req.__authOptionalReason = { case: 'no-authorization-header' };
        return false;
      }
      if (req.headers.authorization.indexOf('Bearer ') !== 0) {
        req.__authOptionalReason = { case: 'not-bearer' };
        return false;
      }
      try {
        const decodedToken = decode(req.headers.authorization.split(' ')[1]);
        if (!decodedToken) {
          req.__authOptionalReason = { case: 'decoded-token-falsy' };
          return false;
        }
        if (decodedToken.iss !== expectedIss) {
          req.__authOptionalReason = {
            case: 'issuer-mismatch',
            tokenIss: decodedToken.iss,
            expectedIss: expectedIss,
            optionsDomain: options.domain
          };
          return false;
        }
        return true;
      } catch (ex) {
        req.__authOptionalReason = { case: 'jwt-decode-threw', message: ex && ex.message };
        return false;
      }
    },
    mw,
    // TEMP DEBUG: surface the skip reason via the API instead of silently
    // falling through (which downstream reads as "Missing scope").
    function(req, res) {
      return res.status(499).json({
        debug: 'authenticateUsers.optional predicate skipped auth',
        reason: req.__authOptionalReason || { case: 'unknown' }
      });
    }
  );
};
