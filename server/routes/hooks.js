import { Router as router } from 'express';

import config from '../lib/config';
import logger from '../lib/logger';
import { middlewares } from 'auth0-extension-express-tools';

export default () => {
  const hookValidator = middlewares
    .validateHookToken(config('AUTH0_DOMAIN'), config('WT_URL'), config('EXTENSION_SECRET'));

  const hooks = router();
  hooks.use('/on-uninstall', hookValidator('/.extensions/on-uninstall'));
  hooks.use(middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  }));
  hooks.delete('/on-uninstall', (req, res) => {
    logger.debug('Uninstall running...');
    req.auth0.clients.delete({ client_id: config('AUTH0_CLIENT_ID') })
      .then(() => {
        logger.debug(`Deleted client ${config('AUTH0_CLIENT_ID')}`);
        res.sendStatus(204);
      })
      .catch((err) => {
        logger.debug(`Error deleting client ${config('AUTH0_CLIENT_ID')}`);
        logger.error(err);
        res.sendStatus(500);
      });
  });
  return hooks;
};
