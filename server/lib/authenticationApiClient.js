import Promise from 'bluebird';

import config from './config';

let auth0 = require('auth0');
if (config('HOSTING_ENV') === 'webtask') {
  auth0 = require('auth0@2.0.0');
}

module.exports.getForClient = (domain, clientId) =>
  Promise.resolve(new auth0.AuthenticationClient({ domain, clientId }));
