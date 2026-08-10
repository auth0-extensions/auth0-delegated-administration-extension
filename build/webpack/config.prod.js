'use strict';

const webpack = require('webpack');
const path = require('path');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const project = require('../../package.json');
const config = require('./config.base.js');

config.mode = 'production';
config.profile = false;

const version = process.env.EXTENSION_VERSION || project.version;
const settings = (project['auth0-extension'] && project['auth0-extension'].settings) || {};

// Assets land in dist/client with the exact names tools/cdn.sh uploads and
// server/routes/html.js references (auth0-delegated-admin.ui.<version>.*).
config.output.filename = `auth0-delegated-admin.ui.${version}.js`;

config.resolve = {
  alias: config.resolve.alias, // preserve base aliases (barrel dep stub)
  extensions: [ '.js', '.jsx' ],
  fallback: {}
};

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
        MiniCssExtractPlugin.loader,
        'css-loader',
        path.resolve(__dirname, './fix-extension-ui-css-loader.js')
      ]
    },
    {
      test: /\.styl$/,
      use: [ MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader' ]
    },
    { test: /\.m?js/, resolve: { fullySpecified: false } }
  ]
};

config.plugins = [
  new MiniCssExtractPlugin({
    filename: `auth0-delegated-admin.ui.${version}.css`
  }),
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(false),
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
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
  new StatsWriterPlugin({
    filename: 'manifest.json',
    transform: function transformData(data) {
      const appAssets = data.assetsByChunkName.app;
      // app chunk emits [css, js] in production; server/routes/html.js reads
      // { style, app, vendors } and serves each at /app/<name>.
      const chunks = {
        style: Array.isArray(appAssets)
          ? appAssets.find(f => f.endsWith('.css'))
          : undefined,
        app: Array.isArray(appAssets)
          ? appAssets.find(f => f.endsWith('.js'))
          : appAssets,
        vendors: `auth0-delegated-admin.ui.vendors.${version}.js`
      };
      return JSON.stringify(chunks);
    }
  }),
  new NodePolyfillPlugin()
];

config.optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        sourceMap: true,
        mangle: true,
        output: { comments: false },
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      }
    })
  ],
  splitChunks: {
    cacheGroups: {
      defaultVendors: false,
      manualVendors: {
        test(module) {
          const resource = module.nameForCondition && module.nameForCondition();
          if (!resource || /\.css$/.test(resource)) return false;
          return new RegExp(`[\\/]node_modules[\\/](${[
          '@remix-run',
          'axios',
          'classnames',
          'codemirror',
          'immutable',
          'jwt-decode',
          'lodash',
          'moment',
          'prop-types',
          'react',
          'react-bootstrap',
          'react-codemirror2',
          'react-dom',
          'react-router',
          'react-router-dom',
          'react-select',
          'react-redux',
          'redux',
          'redux-form',
          'redux-thunk',
          'redux-logger',
          'redux-promise-middleware'
        ].join('|')})[\\/]`).test(resource);
        },
        chunks: 'all',
        enforce: true,
        filename: `auth0-delegated-admin.ui.vendors.${version}.js`
      }
    }
  }
};

module.exports = config;
