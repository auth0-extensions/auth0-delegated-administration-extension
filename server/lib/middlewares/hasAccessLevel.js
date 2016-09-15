import { ForbiddenError } from 'auth0-extension-tools';


module.exports = (level) =>
  (req, res, next) => {
    if (req.user && req.user.role >= level) {
      next();
    } else {
      next(new ForbiddenError('Forbidden! Sorry, you have no permissions to do this.'));
    }
  };
