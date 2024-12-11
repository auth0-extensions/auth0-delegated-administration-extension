const path = require('path');
const nconf = require('nconf');
const logger = require('./server/lib/logger');

// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  ignore: [ /node_modules/ ],
  sourceMaps: !(process.env.NODE_ENV === 'production'),
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-object-rest-spread'
  ],
  presets: [
    [ '@babel/env', {
      targets: {
        node: 'current'
      }
    } ]
  ]
});
// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/polyfill');

// Handle uncaught.
process.on('uncaughtException', (err) => {
  logger.log("error", err);
});

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3001,
    WT_URL: 'http://localhost:3000'
  });

// Start the server.
const app = require('./server').default((key) => nconf.get(key), null);
const port = nconf.get('PORT');

app.listen(port, (error) => {
  if (error) {
    logger.log("error", error);
  } else {
    logger.log("info", `Listening on http://localhost:${port}.`);
  }
});
