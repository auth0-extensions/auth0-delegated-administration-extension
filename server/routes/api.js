import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import { requireScope } from '../lib/middlewares';
import config from '../lib/config';

import ScriptManager from '../lib/scriptmanager';
import getScopes from '../lib/getScopes';
import * as constants from '../constants';

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

  // Allow end users to authenticate.
  api.use(middlewares.authenticateUsers.optional({
    domain: config('AUTH0_DOMAIN'),
    audience: config('EXTENSION_CLIENT_ID'),
    credentialsRequired: false,
    onLoginSuccess: (req, res, next) => {
      const currentRequest = req;
      currentRequest.user.scope = getScopes(req.user);
      next();
    }
  }));

  // Allow dashboard admins to authenticate.
  api.use(middlewares.authenticateAdmins.optional({
    credentialsRequired: false,
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:delegated-admin',
    baseUrl: config('PUBLIC_WT_URL') || config('WT_URL'),
    onLoginSuccess: (req, res, next) => {
      const currentRequest = req;
      currentRequest.user.scope = [ constants.USER_PERMISSION, constants.ADMIN_PERMISSION ];
      next();
    }
  }));

  api.use(requireScope(constants.USER_PERMISSION));
  api.use('/applications', managementApiClient, applications());
  api.use('/connections', managementApiClient, connections(scriptManager));
  api.use('/scripts', requireScope(constants.ADMIN_PERMISSION), scripts(storage, scriptManager));
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
