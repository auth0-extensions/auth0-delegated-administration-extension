const configProvider = require('./config/configProvider');

module.exports.createServer = function(cb) {
  var server = null;

  return function serverFactory(webtaskContext) {
    if (!server) {
      const config = configProvider.fromWebtaskContext(webtaskContext);
      server = cb(config, webtaskContext.storage);
    }

    return server;
  };
};
