/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test';

// Register babel so that it will transpile ES6 to ES5
// before our tests run.

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  sourceMaps: true,
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties'
  ],
  presets: [
    '@babel/react',
    [ '@babel/env', {
      targets: {
        node: 'current'
      }
    } ]
  ]
});
// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/polyfill');

require('./initClientTests');
