import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import { getUserAccessLevel, hasAccessLevel } from '../lib/middlewares';
import config from '../lib/config';
import * as constants from '../constants';

import ScriptManager from '../lib/scriptmanager';

import applications from './applications';
import connections from './connections';
import scripts from './scripts';
import me from './me';
import logs from './logs';
import users from './users';

export default (storage) => {
  const scriptManager = new ScriptManager(storage);
  const managementApiClient = middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  });

  const api = Router();
  api.use(middlewares.authenticateUser(config('AUTH0_DOMAIN'), config('EXTENSION_CLIENT_ID')));
  api.use(getUserAccessLevel);
  api.use(hasAccessLevel(constants.USER_ACCESS_LEVEL));
  api.use('/applications', managementApiClient, applications());
  api.use('/connections', managementApiClient, connections(scriptManager));
  api.use('/scripts', hasAccessLevel(constants.ADMIN_ACCESS_LEVEL), scripts(storage, scriptManager));
  api.use('/users', managementApiClient, users(storage, scriptManager));
  api.use('/logs', managementApiClient, logs(scriptManager));
  api.use('/me', me(scriptManager));
  api.get('/settings', (req, res, next) => {
    const settingsContext = {
      request: {
        user: req.user
      }
    };

    scriptManager.execute('settings', settingsContext)
      .then(settings => res.json({ settings: settings || {} }))
      .catch(next);
  });

  return api;
};
