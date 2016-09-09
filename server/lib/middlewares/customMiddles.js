import { NotFoundError } from 'auth0-extension-tools';
import { getScript } from '../scripts';


module.exports.checkAccess = (req, res, next) => {
  if (req.user.access_level === 2) return next();

  return req.auth0.users.get({ id: req.params.id })
    .then(user => {
      if (!user) {
        next(new NotFoundError('User not found'));
      }

      getScript(req.storage, 'access')
        .then(script => {
          if (script) {
            try {
              script(req.user, user, (err, hasAccess) => {
                if (err || !hasAccess) {
                  next(err || { status: 403, message: 'Forbidden' });
                }

                next();
              });
            } catch (err) {
              next(err);
            }
          } else {
            next();
          }
        })
        .catch(next);

      return null;
    })
    .catch(next);
};

module.exports.prepareUser = (req, res, next) => {
  if (req.user.access_level === 2) return next();

  return getScript(req.storage, 'write')
    .then(script => {
      if (script) {
        try {
          script(req.user, req.body, () => next());
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    })
    .catch(next);
};

module.exports.updateFilter = (req, res, next) => {
  if (req.user.access_level === 2) return next();

  return getScript(req.storage, 'filter')
    .then(script => {
      const request = req;
      const query = req.query.search || '';

      if (!script || req.user.access_level === 2) {
        return next();
      }

      try {
        script(req.user, (err, filter) => {
          request.query.search = (query && filter) ? `(${query}) AND ${filter}` : query || filter;
          next(err);
        });
      } catch (err) {
        next(err);
      }

      return null;
    })
    .catch(next);
};
