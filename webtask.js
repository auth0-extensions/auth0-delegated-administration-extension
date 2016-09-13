const tools = require('auth0-extension-express-tools');

const expressApp = require('./server');
const logger = require('./server/lib/logger');

module.exports = tools.createServer((req, config, storage) => {
  logger.info('Starting Delegated Administration Extension - Version:', config('CLIENT_VERSION'));
  return expressApp(config, storage);
});
