const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const getConfig = require('./client-config.js');

console.info('Running development webpack server...');

module.exports = (rootPath, entry, destination, port = 3000, proxyPort = 3001) =>
  new Promise((resolve, reject) => {
    const mode = 'development';
    const compiler = webpack(getConfig({ name: 'dev-client', version: '0' }, rootPath, mode, entry, destination));
    const options = {
      host: 'localhost',
      port,
      hot: true,
      historyApiFallback: true,
      allowedHosts: 'all',
      devMiddleware: {
        publicPath: `http://localhost:${port}/app/`,
        stats: { colors: true }
      },
      client: {
        logging: 'info'
      },
      proxy: [
        {
          context: () => true,
          target: `http://localhost:${proxyPort}`
        }
      ],
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };

    const server = new WebpackDevServer(options, compiler);
    
    server.startCallback((err) => {
      if (err) {
        console.error(err);
        return reject(err);
      } else {
        console.info(`Development server listening on: http://localhost:${port}`);
        return resolve();
      }
    });
  });
