const tools = require('auth0-extension-tools');

module.exports = function(config) {
  return function(req, res, next) {
    if (req.webtaskContext) {
      config.setProvider(tools.configProvider.fromWebtaskContext(req.webtaskContext));
    }

    return next();
  };
};
