import { ForbiddenError } from '../errors';

module.exports = (level) =>
  (req, res, next) => {
    if (req.user && req.user.access_level >= level) {
      next();
    } else {
      next(new ForbiddenError('Forbidden'));
    }
  };

