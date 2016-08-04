import { validateHookToken } from 'auth0-extension-tools';

import config from '../config';
import logger from '../logger';

module.exports = (hookPath) =>
  (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const token = req.headers.authorization.split(' ')[1];
      if (validateHookToken(config('AUTH0_DOMAIN'), config('WT_URL'), hookPath, config('EXTENSION_SECRET'), token)) {
        return next();
      }

      logger.error('Invalid hook token:', token);
      return res.sendStatus(401);
    }

    logger.error('Hook token is missing.');
    return res.sendStatus(401);
  };
