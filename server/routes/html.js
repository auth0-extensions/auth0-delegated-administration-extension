import fs from 'fs';
import url from 'url';
import ejs from 'ejs';
import path from 'path';
import { urlHelpers } from 'auth0-extension-express-tools';

import config from '../lib/config';

export default () => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title><%= config.TITLE %></title>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="<%= assets.favIcon %>" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css" />
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css" />
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.min.css" />
      <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>
      <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="<%= assets.cdnPath %>/auth0-delegated-admin.ui.<%= assets.version %>.css" /><% } %>
      <% if (assets.customCss) { %><link rel="stylesheet" type="text/css" href="<%= assets.customCss %>" /><% } %>
    </head>
    <body>
      <div id="app"></div>
      <script src="https://cdn.auth0.com/js/auth0/9.8.2/auth0.min.js"></script>
      <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"></script>
      <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
      <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
      <% if (assets.app) { %><script type="text/javascript" src="/app/<%= assets.app %>"></script><% } %>
      <% if (assets.version) { %>
      <script type="text/javascript" src="<%= assets.cdnPath %>/auth0-delegated-admin.ui.vendors.<%= assets.version %>.js"></script>
      <script type="text/javascript" src="<%= assets.cdnPath %>/auth0-delegated-admin.ui.<%= assets.version %>.js"></script>
      <% } %>
    </body>
    </html>
    `;

  const getLocale = (req) => {
    const basePath = urlHelpers.getBasePath(req);
    const pathname = url.parse(req.originalUrl).pathname;
    const relativePath = pathname.replace(basePath, '').split('/');
    const routes = [
      'api',
      'login',
      'logs',
      'configuration',
      'users'
    ];
    if (routes.indexOf(relativePath[0]) < 0 && relativePath[0] !== '') {
      return relativePath[0];
    }

    return req.cookies['dae-locale'] || 'en';
  };

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    const locale = getLocale(req);
    const basePath = urlHelpers.getBasePath(req);

    if (req.url.indexOf('/login') !== 0) {
      res.cookie('dae-locale', locale);
      if (req.url.indexOf(`/${locale}`) !== 0) {
        return res.redirect(`${basePath}${locale}${req.url || '/login'}`);
      }
    }

    const settings = {
      AUTH0_DOMAIN: config('AUTH0_ISSUER_DOMAIN'),
      AUTH0_TOKEN_ISSUER: `https://${config('AUTH0_ISSUER_DOMAIN')}/`,
      AUTH0_CLIENT_ID: config('EXTENSION_CLIENT_ID'),
      EXTEND_URL: config('EXTEND_URL'),
      BASE_URL: urlHelpers.getBaseUrl(req),
      BASE_PATH: `${basePath}${locale}/`,
      TITLE: config('TITLE'),
      FEDERATED_LOGOUT: config('FEDERATED_LOGOUT') === 'true',
      AUTH0_MANAGE_URL: config('AUTH0_MANAGE_URL') || 'https://manage.auth0.com',
      LOCALE: locale
    };

    // Render from CDN.
    const clientVersion = process.env.CLIENT_VERSION;
    const PR_NUMBER = process.env.PR_NUMBER;
    if (clientVersion) {
      const favIcon = config('FAVICON_PATH') || 'https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png';
      const cdnPath = config('CDN_PATH') || (
        PR_NUMBER
          ? `//s3.amazonaws.com/extensions-review/auth0-delegated-admin-pr-${PR_NUMBER}/assets`
          : '//cdn.auth0.com/extensions/auth0-delegated-admin/assets'
      );

      return res.send(ejs.render(template, {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          version: clientVersion,
          cdnPath: cdnPath,
          favIcon: favIcon
        }
      }));
    }

    // Render locally.
    return fs.readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8', (err, manifest) => {
      const locals = {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          app: 'bundle.js'
        }
      };

      if (!err && manifest) {
        locals.assets = {
          customCss: config('CUSTOM_CSS'),
          ...JSON.parse(manifest)
        };
      }

      // Render the HTML page.
      res.send(ejs.render(template, locals));
    });
  };
};
