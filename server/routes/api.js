import { Router } from 'express';
import _ from 'lodash';
import moment from 'moment';
import { middlewares } from 'auth0-extension-express-tools';
import { ManagementClient} from 'auth0';
import tools from 'auth0-extension-tools';

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

  // moving the managementApiClient middleware function here so that it
  // can use the new version of the auth0 dep, not the one specified
  // by the auth0-extension-express-tools library
  const managementApiClient = async function (req, res, next) {
    try {
      const handlerOptions = {
        domain: config("AUTH0_DOMAIN"),
        clientId: config("AUTH0_CLIENT_ID"),
        clientSecret: config("AUTH0_CLIENT_SECRET"),
      };

      console.log({
        domain: config('AUTH0_DOMAIN'),
        clientId: config('AUTH0_CLIENT_ID'),
        clientSecret: config('AUTH0_CLIENT_SECRET')
      });

      const isAdministrator =
        req.user && req.user.access_token && req.user.access_token.length;
      const options = !isAdministrator
        ? handlerOptions
        : {
            domain: handlerOptions.domain,
            accessToken: req.user.access_token,
            headers: handlerOptions.headers,
          };

      var managementClient = new ManagementClient(options);

      req.auth0 = managementClient;

      console.log({
        "req.originalUrl": req.originalUrl,
        "typeof req.auth0": typeof req.auth0,
      });

      next();
      return null;
    } catch (error) {
      next(error);
    }
  };

  const api = Router();
  const getToken = req => _.get(req, 'headers.authorization', '').split(' ')[1];
  console.log({ stage: 5 });
  
  const addExtraUserInfo = (token, user) => {
    global.daeUser = global.daeUser || {};
    global.daeUser[user.sub] = global.daeUser[user.sub] || { exp: 0, token: '' };

    if (_.isFunction(global.daeUser[user.sub].then)) {
      return global.daeUser[user.sub];
    }

    if (global.daeUser[user.sub].exp > moment().unix() && token &&
      global.daeUser[user.sub].token === token) {
      _.assign(user, global.daeUser[user.sub]);
      return Promise.resolve(user);
    }

    if (!token) console.error('no token found');

    console.log({
      domain: config('AUTH0_DOMAIN'),
      clientId: config('AUTH0_CLIENT_ID'),
      clientSecret: config('AUTH0_CLIENT_SECRET')
    });

    const promise = tools.managementApi.getClient({
      domain: config('AUTH0_DOMAIN'),
      clientId: config('AUTH0_CLIENT_ID'),
      clientSecret: config('AUTH0_CLIENT_SECRET')
    })
      .then(auth0 =>
        auth0.users.get({ id: user.sub })
          .then((userData) => {
            _.assign(user, userData);
            user.token = token;
            global.daeUser[user.sub] = user;
            return user;
          })
      );

    global.daeUser[user.sub] = promise;

    return global.daeUser[user.sub];
  };

  console.log({ stage: 8 });
  
  console.log({
    "config('AUTH0_CUSTOM_DOMAIN')": config('AUTH0_CUSTOM_DOMAIN'),
    "config('AUTH0_DOMAIN')": config('AUTH0_DOMAIN'),
    "config('EXTENSION_CLIENT_ID')": config('EXTENSION_CLIENT_ID'),
  })

  // Allow end users to authenticate.
  api.use(middlewares.authenticateUsers.optional({
    domain:  config('AUTH0_CUSTOM_DOMAIN') || config('AUTH0_DOMAIN'),
    audience: config('EXTENSION_CLIENT_ID'),
    credentialsRequired: false,
    onLoginSuccess: (req, res, next) => {
      const currentRequest = req;
      return addExtraUserInfo(getToken(req), req.user)
        .then((user) => {

          console.log({ user });

          currentRequest.user = user;
          currentRequest.user.scope = getScopes(req.user);
          return next();
        })
        .catch(next);
    }
  })););
  // Allow dashboard admins to authenticate.
  api.use(middlewares.authenticateAdmins.optional({
    credentialsRequired: false,
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:delegated-admin',
    baseUrl: config('PUBLIC_WT_URL'),
    onLoginSuccess: (req, res, next) => {
      const currentRequest = req;
      return addExtraUserInfo(getToken(req), req.user)
        .then((user) => {

          console.log({ user });

          currentRequest.user = user;
          currentRequest.user.scope = [ constants.AUDITOR_PERMISSION, constants.USER_PERMISSION, constants.OPERATOR_PERMISSION, constants.ADMIN_PERMISSION ];
          return next();
        })
        .catch(next);
    }
  }));

  /* Fight caching attempts by IE */
  api.use((req, res, next) => {
    res.setHeader('Cache-control', 'no-cache, no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });
;

  api.use((req, res, next) => {
    const permission = (req.method.toLowerCase() === 'get') ? constants.AUDITOR_PERMISSION : constants.USER_PERMISSION;
    return requireScope(permission)(req, res, next);
  });;
  api.use('/applications', managementApiClient, applications());;
  api.use('/connections', managementApiClient, connections(scriptManager));;
  api.use('/scripts', requireScope(constants.ADMIN_PERMISSION), scripts(storage, scriptManager));;
  api.use('/users', managementApiClient, users(storage, scriptManager));;
  api.use('/logs', managementApiClient, logs(scriptManager));;
  api.use('/me', me(scriptManager));;
  api.get('/settings', (req, res, next) => {;
    const settingsContext = {
      request: {
        user: req.user
      },
      locale: req.headers['dae-locale']
    };

    scriptManager.execute('settings', settingsContext)
      .then(settings => res.json({ settings: settings || {} }))
      .catch(next);
    
  });
;
  return api;
}
;
