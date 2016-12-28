import { Router } from 'express';
import { middlewares, routes } from 'auth0-extension-express-tools';

import { requireScope } from '../lib/middlewares';
import config from '../lib/config';

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
  api.use(routes.dashboardAdmins({
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:delegated-admin',
    rta: config('AUTH0_RTA').replace('https://', ''),
    domain: config('AUTH0_DOMAIN'),
    baseUrl: config('PUBLIC_WT_URL'),
    clientName: 'Delegated Administration',
    urlPrefix: '/admins',
    sessionStorageKey: 'delegated-admin:apiToken',
    scopes: 'read:clients delete:clients read:connections read:users update:users delete:users create:users read:logs read:device_credentials update:device_credentials delete:device_credentials'
  }));

  // Allow end users to authenticate.
  api.use(middlewares.authenticateUsers.optional({
    domain: config('AUTH0_DOMAIN'),
    audience: config('EXTENSION_CLIENT_ID'),
    credentialsRequired: false,
    onLoginSuccess: (req, res, next) => {
      const currentRequest = req;
      currentRequest.user.scope = req.user.permissions || req.user.app_metadata.permissions || req.user.app_metadata.authorization.permissions;
      next();
    }
  }));

  // Allow dashboard admins to authenticate.
  api.use(middlewares.authenticateAdmins.optional({
    credentialsRequired: false,
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:delegated-admin',
    baseUrl: config('PUBLIC_WT_URL'),
    onLoginSuccess: (req, res, next) => {
      const currentRequest = req;
      currentRequest.user.scope = [ 'manage:users', 'manage:configuration' ];
      next();
    }
  }));

  api.use(requireScope('manage:users'));
  api.use('/applications', managementApiClient, applications());
  api.use('/connections', managementApiClient, connections(scriptManager));
  api.use('/scripts', requireScope('manage:configuration'), scripts(storage, scriptManager));
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
