import jwt from 'express-jwt';
import { Router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import { expressJwtSecret, SigningKeyNotFoundError } from 'jwks-rsa';
import { getUserAccessLevel, hasAccessLevel } from '../lib/middlewares';
import config from '../lib/config';

import applications from './applications';
import connections from './connections';
import scripts from './scripts';
import logs from './logs';
import users from './users';

export default () => {
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
  api.use(hasAccessLevel(1));
  api.use('/applications', applications());
  api.use('/connections', connections());
  api.use('/scripts', scripts());
  api.use('/users', users());
  api.use('/logs', logs());
  return api;
};
