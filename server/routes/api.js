import jwt from 'express-jwt';
import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import { expressJwtSecret, SigningKeyNotFoundError } from 'jwks-rsa';
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
  api.use(jwt({
    secret: expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config('AUTH0_DOMAIN')}/.well-known/jwks.json`,
      handleSigningKeyError: (err, cb) => {
        if (err instanceof SigningKeyNotFoundError) {
          const unauthorized = new Error('A token was provided with an invalid kid');
          unauthorized.status = 401;
          return cb(unauthorized);
        }

        return cb(err);
      }
    }),

    // Validate the audience and the issuer.
    audience: config('EXTENSION_CLIENT_ID'),
    issuer: `https://${config('AUTH0_DOMAIN')}/`,
    algorithms: [ 'RS256' ]
  }));
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
  api.use('/logs', logs());

  api.get('/styles', (req, res, next) => {
    const stylesContext = {
      request: {
        user: req.user
      }
    };

    scriptManager.execute('styles', stylesContext)
      .then(styles => res.json(styles))
      .catch(next);
  });

  api.get('/me', (req, res, next) => {
    const membershipContext = {
      request: {
        user: req.user
      }
    };

    scriptManager.execute('memberships', membershipContext)
      .then(memberships => res.json({ memberships: memberships || [ ], role: req.user.role || 0 }))
      .then(() => res.status(200).send())
      .catch(next);
  });

  return api;
};
