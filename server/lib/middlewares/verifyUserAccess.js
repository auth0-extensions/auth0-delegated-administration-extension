import { NotFoundError } from 'auth0-extension-tools';

import * as constants from '../../constants';

module.exports = (scriptManager) => (req, res, next) =>
  req.auth0.users.get({ id: req.params.id })
    .then(user => {
      if (!user) {
        throw new NotFoundError(`User not found: ${req.params.id}`);
      }

      const accessContext = {
        request: {
          user: req.user
        },
        payload: {
          user
        }
      };

      return scriptManager.execute('access', accessContext);
    })
    .then(next)
    .catch(next);
