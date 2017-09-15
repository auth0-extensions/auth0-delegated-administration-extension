const config = require('auth0-extension-tools').config();

const oldGet = config.get;

config.get = function(key) {
  if (key === 'AUTH0_ISSUER_DOMAIN') {
    return oldGet('AUTH0_ISSUER_DOMAIN') || oldGet('AUTH0_DOMAIN');
  }

  return oldGet(key);
};

module.exports = config;
