const UnauthorizedError = require('auth0-extension-tools').UnauthorizedError;

module.exports = function(req, res, next) {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required for this endpoint.'));
  }

  return next();
};
