import Promise from 'bluebird';
import { NotFoundError } from 'auth0-extension-tools';


module.exports = (action, scriptManager) => (req, res, next) =>
  req.auth0.users.get({ id: req.params.id })
    .then(user => {
      if (!user) {
        return Promise.reject(new NotFoundError(`User not found: ${req.params.id}`));
      }

      const accessContext = {
        request: {
          user: req.user
        },
        payload: {
          user,
          action
        }
      };

      return scriptManager.execute('access', accessContext);
    })
    .then(() => next())
    .catch(next);
