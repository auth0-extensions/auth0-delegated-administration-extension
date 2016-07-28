import jwt from 'express-jwt';
import { Router } from 'express';

import { expressJwtSecret } from 'jwks-rsa';
import config from '../lib/config';
import * as middlewares from '../lib/middlewares';

import applications from './applications';
import connections from './connections';
import logs from './logs';
import users from './users';

export default (app, storage) => {
  const jwtSettings = {
    secret: expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config('AUTH0_DOMAIN')}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: null,
    issuer: `https://${config('AUTH0_DOMAIN')}/`,
    algorithms: [ 'RS256' ]
  };

  const api = Router();
  api.use(middlewares.managementClient);
  api.use(middlewares.audience(app, storage));
  api.use((req, res, next) => {
    if (!jwtSettings.audience) {
      jwtSettings.audience = req.settings.AUTH0_CLIENT_ID;
    }

    if (!jwtSettings.audience) {
      return next(new Error('The audience is not configured.'));
    }
    next();
  });
  api.use(jwt(jwtSettings));
  api.use('/applications', applications());
  api.use('/connections', connections());
  api.use('/users', users());
  api.use('/logs', logs());
  return api;
};
