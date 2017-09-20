const config = require('auth0-extension-tools').config();

const daeConfig = function(key) {
  if (key === 'AUTH0_ISSUER_DOMAIN') {
    return config('AUTH0_ISSUER_DOMAIN') || config('AUTH0_DOMAIN');
  }

  return config(key);
};

daeConfig.getValue = function(key) {
  return config.getValue(key);
}

daeConfig.setValue = function(key, value) {
  return config.setValue(key, value);
}

daeConfig.setProvider = function(provider) {
  return config.setProvider(provider);
}

module.exports = daeConfig;
