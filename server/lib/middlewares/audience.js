import logger from '../logger';
import { readStorage } from '../storage';

module.exports = (app, storage) =>
  (req, res, next) => {
    if (app.settings && app.settings.AUTH0_CLIENT_ID) {
      req.settings = req.settings || { };
      req.settings.AUTH0_CLIENT_ID = app.settings.AUTH0_CLIENT_ID;
      return next();
    }

    return readStorage(storage)
      .then(data => {
        if (data && data.settings && data.settings.AUTH0_CLIENT_ID) {
          app.set('AUTH0_CLIENT_ID', data.settings.AUTH0_CLIENT_ID);
          req.settings = req.settings || { };
          req.settings.AUTH0_CLIENT_ID = app.settings.AUTH0_CLIENT_ID;

          logger.info('Audience set to:', app.settings.AUTH0_CLIENT_ID);
          return next();
        }

        throw new Error('AUTH0_CLIENT_ID is missing in the settings.');
      })
      .catch(next);
  };
