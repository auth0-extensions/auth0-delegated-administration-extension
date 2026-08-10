'use strict';

const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const project = require('../../package.json');
const settings = (project['auth0-extension'] && project['auth0-extension'].settings) || {};

const WEBPACK_HOST = 'localhost';
// The webpack dev server serves the bundle on 3000; the Hapi backend runs on
// 3001 and the dev server proxies to it (see build/webpack/server.js).
const WEBPACK_PORT = 3000;

// Override base configuration.
const config = require('./config.base.js');

config.mode = 'development';
config.devtool = 'eval-source-map';
config.entry = [ config.entry.app ];
config.output.publicPath = `http://${WEBPACK_HOST}:${WEBPACK_PORT}${config.output.publicPath}`;

config.stats = { colors: true, reasons: true };

// The dev HTML (server/routes/html.js) loads /app/bundle.js, so pin the name.
config.output.filename = 'bundle.js';
config.resolve.extensions = [ '.js', '.jsx', '.json' ];

config.module = {
  rules: [
    {
      test: /\.jsx?$/,
      use: [ { loader: 'babel-loader' } ],
      exclude: path.join(__dirname, '../../node_modules/')
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        path.resolve(__dirname, './fix-extension-ui-css-loader.js')
      ]
    },
    {
      test: /\.styl$/,
      use: [ 'style-loader', 'css-loader', 'stylus-loader' ]
    },
    { test: /\.m?js/, resolve: { fullySpecified: false } }
  ]
};

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(true),
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify('development'),
      WARN_DB_SIZE: JSON.stringify(settings.WARN_DB_SIZE),
      MAX_MULTISELECT_USERS: JSON.stringify(settings.MAX_MULTISELECT_USERS),
      MULTISELECT_DEBOUNCE_MS: JSON.stringify(settings.MULTISELECT_DEBOUNCE_MS),
      PER_PAGE: JSON.stringify(settings.PER_PAGE)
    },
    __CLIENT__: JSON.stringify(true),
    __SERVER__: JSON.stringify(false)
  }),
  new webpack.ProvidePlugin({
    React: 'react',
    process: 'process/browser'
  }),
  new NodePolyfillPlugin()
]);

module.exports = config;
