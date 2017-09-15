const config = require('auth0-extension-tools').config();

const daeConfig = function(key) {
  if (key === 'AUTH0_ISSUER_DOMAIN') {
    return config('AUTH0_ISSUER_DOMAIN') || config('AUTH0_DOMAIN');
  }

  return config(key);
};

daeConfig.setProvider = function(provider) {
  return config.setProvider(provider);
}

module.exports = daeConfig;
