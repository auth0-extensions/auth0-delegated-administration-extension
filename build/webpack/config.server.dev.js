'use strict';

const path = require('path');
const webpack = require('webpack');

const project = require('../../package.json');

// Mirror the way auth0-extensions-cli (`a0-ext build:server`) resolves and
// externalizes the SERVER bundle, so local `serve:dev` exercises the same
// module resolution as the deployed webtask.
//
// Why this exists: `serve:dev` used to run the raw server source through
// @babel/register (Node's CommonJS resolver), while the webtask runs a webpack
// bundle (`target: 'node'`). Those two resolvers disagree for packages that
// ship both a CJS and an ESM build: Node reads `main` (CJS), webpack prefers
// `module` (ESM). That divergence let a real bug — the vendored
// `require('jwt-decode')` resolving to the ESM `{ default: fn }` namespace
// instead of a callable — pass locally but break in the webtask. Bundling the
// server here with the same resolution rules makes local reproduce it.
//
// This is a LOCAL DEV artifact only; the real webtask bundle is still produced
// by `a0-ext build:server` in `extension:build`.

const rootPath = path.join(__dirname, '../..');

// Mirror which deps the webtask keeps external vs. bundles: each `externals`
// entry (e.g. "jwks-rsa@3.0.1") is emitted as a runtime require() instead of
// being bundled.
//
// The CLI maps these to `commonjs jwks-rsa@3.0.1` (the version tag is metadata
// the webtask's canirequire understands). Node's require() does NOT understand
// a "@version" suffix, so LOCALLY we must require the bare module name — it
// resolves from node_modules, which is the correct local analogue of the
// externalized dep. The bundled-vs-external SPLIT is what we're reproducing
// here; the exact version pin is a webtask-registry concern.
const mappings = (project['auth0-extension'] && project['auth0-extension'].externals) || [];
const externals = mappings.reduce((acc, dep) => {
  const versionIndex = dep.lastIndexOf('@');
  const name = versionIndex > 0 ? dep.substring(0, versionIndex) : dep;
  acc[name] = `commonjs ${name}`;
  return acc;
}, {});

module.exports = {
  // Entry is a dev-only shim (server-entry.dev.js), not index.js: it keeps the
  // local nconf + FileStorageContext bootstrap so the bundle runs without a
  // webtaskContext, but WITHOUT index.js's `@babel/register` runtime hook
  // (which would drag @babel/core into the bundle). The real webtask entry
  // (webtask.js) is likewise babel-register-free — webpack transpiles at build
  // time. Every server require() still routes through webpack's resolver.
  entry: path.join(__dirname, 'server-entry.dev.js'),
  mode: 'development',
  target: 'node',
  // Node-friendly source maps; keep the original source visible in stack traces.
  devtool: 'source-map',
  output: {
    path: path.join(rootPath, 'dist'),
    filename: 'server.dev.js',
    libraryTarget: 'commonjs2'
  },
  externals,
  // Do NOT set resolve.mainFields — webpack's default for target:'node' is
  // ['module', 'main'], which is exactly what the CLI relies on. Leaving it
  // default is what reproduces the ESM-preference behavior.
  resolve: {
    modules: [ 'node_modules', path.join(rootPath, 'node_modules') ],
    extensions: [ '.js', '.json' ]
  },
  plugins: [
    // The bundle lands in dist/, so runtime __dirname (node.__dirname:false)
    // points there — relative paths to server/config.json would climb wrong.
    // Bake the absolute repo-root config path in at build time instead.
    new webpack.DefinePlugin({
      __DAE_CONFIG_FILE__: JSON.stringify(path.join(rootPath, 'server/config.json'))
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // Transpile our own source AND the vendored tree (which is authored in
        // ESM/modern syntax), but leave node_modules alone.
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [ require.resolve('@babel/preset-env'), { targets: { node: 'current' } } ]
            ],
            plugins: [
              require.resolve('@babel/plugin-proposal-export-default-from'),
              require.resolve('@babel/plugin-proposal-object-rest-spread')
            ]
          }
        }
      }
    ]
  },
  // Keep output readable and avoid webpack's node-mocking of __dirname/__filename
  // so path.join(__dirname, ...) in index.js/server resolve to real paths.
  node: {
    __dirname: false,
    __filename: false
  },
  optimization: {
    minimize: false
  },
  stats: 'minimal'
};
