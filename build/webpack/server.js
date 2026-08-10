const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// Use the project's own dev webpack config rather than auth0-extensions-cli's
// startDevServer: the CLI builds its config internally and can't load the
// stylus loader, the @a0/auth0-extension-ui CSS fix, or the react-dropzone stub
// this extension needs.
const config = require('./config.dev.js');

const DEV_SERVER_PORT = 3000;
const BACKEND_PORT = 3001;

console.info('Running development webpack server...');

const compiler = webpack(config);

const server = new WebpackDevServer(
  {
    host: 'localhost',
    port: DEV_SERVER_PORT,
    hot: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    devMiddleware: {
      publicPath: `http://localhost:${DEV_SERVER_PORT}/app/`,
      stats: { colors: true }
    },
    client: { logging: 'info' },
    proxy: [ { context: () => true, target: `http://localhost:${BACKEND_PORT}` } ],
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  compiler
);

server.startCallback((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }
  console.info(`Development server listening on: http://localhost:${DEV_SERVER_PORT}`);
  require('../../index');
});
