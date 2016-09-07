import { ForbiddenError } from '../errors';

module.exports = function isSuperAdmin(req, res, next) {
  if (req.user && req.user.access_level === 2) {
    next();
  } else {
    next(new ForbiddenError('Only super-admins can use this stuff'));
  }
};
