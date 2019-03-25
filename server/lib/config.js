const config = require('auth0-extension-tools').config();

const daeConfig = function (key) {
  if (key === 'AUTH0_CUSTOM_DOMAIN') {
    return config('AUTH0_CUSTOM_DOMAIN') || config('AUTH0_DOMAIN');
  }

  if (key === 'IS_APPLIANCE') {
    return config('AUTH0_RTA') && config('AUTH0_RTA').replace('https://', '') === 'auth0.auth0.com';
  }

  return config(key);
};

daeConfig.getValue = function (key) {
  return config(key);
};

daeConfig.setValue = function (key, value) {
  return config.setValue(key, value);
};

daeConfig.setProvider = function (provider) {
  return config.setProvider(provider);
};

module.exports = daeConfig;
