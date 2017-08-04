import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { urlHelpers } from 'auth0-extension-express-tools';

import config from '../lib/config';

export default () => {
  let template = '<!DOCTYPE html>';
  template += `
<html lang="en">
<head>
  <title><%= config.TITLE %></title>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.min.css" />
  <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>
  <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-delegated-admin/assets/auth0-delegated-admin.ui.<%= assets.version %>.css" /><% } %>
  <% if (assets.customCss) { %><link rel="stylesheet" type="text/css" href="<%= assets.customCss %>" /><% } %>
</head>
<body>
  <div id="app"></div>
  <script type="text/javascript" src="//cdn.auth0.com/w2/auth0-7.6.1.min.js"></script>
  <script src="https://cdn.auth0.com/auth0-extend/1/extend-editor.js"></script>
  <script src="https://cdn.auth0.com/webtask-editor/editors/1/function-editor.js"></script>
  <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"></script>
  <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
  <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
  <% if (assets.app) { %><script type="text/javascript" src="http://localhost:3001/app/<%= assets.app %>"></script><% } %>
  <% if (assets.version) { %>
  <script type="text/javascript" src="<%= assets.cdnPath %>/auth0-delegated-admin.ui.vendors.<%= assets.version %>.js"></script>
  <script type="text/javascript" src="<%= assets.cdnPath %>/auth0-delegated-admin.ui.<%= assets.version %>.js"></script>
  <% } %>
</body>
</html>
  `;

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    const settings = {
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: config('EXTENSION_CLIENT_ID'),
      EXTEND_URL: config('EXTEND_URL'),
      BASE_URL: urlHelpers.getBaseUrl(req),
      BASE_PATH: urlHelpers.getBasePath(req),
      TITLE: config('TITLE'),
      FEDERATED_LOGOUT: config('FEDERATED_LOGOUT') === 'true',
    };

    // Render from CDN.
    const clientVersion = process.env.CLIENT_VERSION;
    if (clientVersion) {
      const cdnPath = config('CDN_PATH') || '//cdn.auth0.com/extensions/auth0-delegated-admin/assets';
      return res.send(ejs.render(template, {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          version: clientVersion,
          cdnPath: cdnPath
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
