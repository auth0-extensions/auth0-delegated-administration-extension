import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import { getUserAccessLevel, hasAccessLevel } from '../lib/middlewares';
import config from '../lib/config';
import * as constants from '../constants';

import ScriptManager from '../lib/scriptmanager';

import applications from './applications';
import connections from './connections';
import scripts from './scripts';
import logs from './logs';
import users from './users';

export default (storage) => {
  const scriptManager = new ScriptManager(storage);

  const api = Router();

  api.use(middlewares.authenticateUser(config('AUTH0_DOMAIN'), config('EXTENSION_CLIENT_ID')));
  api.use(middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  }));
  api.use(getUserAccessLevel);
  api.use(hasAccessLevel(constants.ADMIN_ACCESS_LEVEL));
  api.use('/applications', applications());
  api.use('/connections', connections());
  api.use('/scripts', hasAccessLevel(constants.SUPER_ACCESS_LEVEL), scripts(storage, scriptManager));
  api.use('/users', users(storage, scriptManager));
  api.use('/logs', logs(scriptManager));

  api.get('/settings', (req, res, next) => {
    const stylesContext = {
      request: {
        user: req.user
      }
    };

    scriptManager.execute('settings', stylesContext)
      .then(settings => res.json({ settings }))
      .catch(next);
  });

  api.get('/me', (req, res, next) => {
    const membershipContext = {
      request: {
        user: req.user
      }
    };

    scriptManager.execute('memberships', membershipContext)
      .then(memberships => res.json({ memberships: memberships || [], role: req.user.role || 0 }))
      .catch(next);
  });

  return api;
};
