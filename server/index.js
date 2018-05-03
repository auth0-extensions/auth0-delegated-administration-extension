import path from 'path';
import morgan from 'morgan';
import Express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as tools from 'auth0-extension-tools';
import { routes } from 'auth0-extension-express-tools';

import api from './routes/api';
import hooks from './routes/hooks';
import meta from './routes/meta';
import htmlRoute from './routes/html';
import config from './lib/config';
import logger from './lib/logger';
import { errorHandler } from './lib/middlewares';

module.exports = (cfg, storageProvider) => {
  config.setProvider(cfg);

  const storage = storageProvider
    ? new tools.WebtaskStorageContext(storageProvider, { force: 1 })
    : new tools.FileStorageContext(path.join(__dirname, './data.json'), { mergeWrites: true });

  const app = new Express();
  app.use((req, res, next) => {
    if (req.webtaskContext) {
      config.setProvider(tools.configProvider.fromWebtaskContext(req.webtaskContext));
    }

    next();
  });
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Configure routes.
  app.use(routes.dashboardAdmins({
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:delegated-admin',
    rta: config('AUTH0_RTA').replace('https://', ''),
    domain: config('AUTH0_ISSUER_DOMAIN'),
    baseUrl: config('PUBLIC_WT_URL'),
    webtaskUrl: config('PUBLIC_WT_URL'),
    clientName: 'Delegated Administration',
    urlPrefix: '/admins',
    sessionStorageKey: 'delegated-admin:apiToken',
    scopes: 'read:clients delete:clients read:connections read:users update:users delete:users create:users read:logs read:device_credentials update:device_credentials delete:device_credentials delete:guardian_enrollments'
  }));

  app.use('/api', api(storage));
  app.use('/app', Express.static(path.join(__dirname, '../dist')));
  app.use('/meta', meta());
  app.use('/.extensions', hooks());

  // Fallback to rendering HTML.
  app.get('*', cookieParser(), htmlRoute());

  // Generic error handler.
  app.use(errorHandler(logger.error));
  return app;
};
