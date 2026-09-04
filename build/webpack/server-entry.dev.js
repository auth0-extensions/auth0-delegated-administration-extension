// Dev-only server entry for the locally-webpacked backend (config.server.dev.js).
//
// This mirrors index.js's local bootstrap (nconf config + FileStorageContext via
// server/index.js's null-storageProvider branch + app.listen) but WITHOUT the
// `@babel/register` runtime hook that index.js uses. The webtask entry
// (webtask.js) has no @babel/register either — webpack transpiles the source at
// build time via babel-loader. Pulling in @babel/register would bundle
// @babel/core and its optional presets, which is both wrong for a bundle and
// noisy to resolve. Keeping this entry babel-register-free matches how the real
// webtask bundle is produced.

const nconf = require('nconf');
const logger = require('../../server/lib/logger');

// Absolute path to server/config.json, injected at build time by
// config.server.dev.js's DefinePlugin (runtime __dirname points at dist/, so a
// relative path would resolve wrong).
/* global __DAE_CONFIG_FILE__ */
const configFile = __DAE_CONFIG_FILE__;

// Handle uncaught.
process.on('uncaughtException', (err) => {
  logger.log('error', err);
});

// Initialize configuration (same order/defaults as index.js).
nconf
  .argv()
  .env()
  .file(configFile)
  .defaults({
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3001,
    WT_URL: 'http://localhost:3000'
  });

// Start the server. null storageProvider selects FileStorageContext locally,
// exactly like index.js.
const app = require('../../server').default((key) => nconf.get(key), null);
const port = nconf.get('PORT');

app.listen(port, (error) => {
  if (error) {
    logger.log('error', error);
  } else {
    logger.log('info', `Listening on http://localhost:${port}.`);
  }
});
