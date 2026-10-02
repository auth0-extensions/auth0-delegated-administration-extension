const _ = require('lodash');
const path = require('path');
const semver = require('semver');
const TerserPlugin = require('terser-webpack-plugin');
const Webpack = require('webpack');

function convertDependenciesToCommonJS(dependencies) {
  return dependencies.reduce((acc, dep) => {
    const versionIndex = dep.lastIndexOf('@');

    if (versionIndex > 0) {
      acc[dep.substring(0, versionIndex)] = `commonjs ${dep}`;
    } else {
      acc[dep] = `commonjs ${dep}`;
    }
    return acc;
  }, {});
}

const excludeModules = list =>
  (modulePath) => {
    if (modulePath.indexOf('node_modules') < 0) {
      return false;
    }

    let isIncluded = true;

    _.each(list, (module) => {
      if (modulePath.indexOf(path.join('node_modules', module)) >= 0) {
        isIncluded = false;
      }
    });

    return isIncluded;
  };

module.exports = (pkg, rootPath, args, ext) => {
  const externals = Object.assign({}, ext);
  const extension = pkg['auth0-extension'] || { };
  const dependencies = pkg.dependencies;
  const mappings = extension.externals || [];
  const excluded = extension.excluded || ['express-conditional-middleware', 'pino'];
  const additionalSettings = _.pickBy(process.env, (val, key) => key.startsWith('A0EXT_') || key === 'PR_NUMBER');
  const settings = _.assign(extension.settings, {
    NODE_ENV: 'production',
    CLIENT_VERSION: pkg.version
  }, additionalSettings);

  // Transform to JSON.
  Object.keys(settings).forEach((k) => {
    settings[k] = JSON.stringify(settings[k]);
  });

  const activePlugins = [];
  const activeLoaders = [];

  let babelExclude;
  if (typeof extension.bundleModules !== 'undefined' && extension.bundleModules === false) {
    externals.compatible = convertDependenciesToCommonJS(Object.keys(dependencies));
    babelExclude = /node_modules/;
  } else {
    // Add custom mappings to externals.
    externals.compatible = convertDependenciesToCommonJS(mappings);
    babelExclude = excludeModules(excluded);
  }

  let ecma = 6;
  let nodeTarget = '4.2.0'; // 1st Node 4 LTS release
  const nodeTargetLoose = semver.coerce(extension.nodeTarget);
  if (nodeTargetLoose && semver.valid(nodeTargetLoose.version)) {
    nodeTarget = nodeTargetLoose.version;
    if (semver.satisfies(nodeTargetLoose, '8.x')) {
      ecma = 8;
    }
  }

  if (typeof extension.useBabel === 'undefined' || extension.useBabel === true) {
    activeLoaders.push({
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [require.resolve('@babel/preset-env'), {
              targets: {
                node: nodeTarget
              },
              shippedProposals: true
            }]
          ],
          plugins: [
            require.resolve('@babel/plugin-proposal-class-properties'),
            require.resolve('@babel/plugin-transform-private-methods'),
            require.resolve('@babel/plugin-proposal-export-default-from'),
            require.resolve('@babel/plugin-proposal-export-namespace-from'),
            [require.resolve('@babel/plugin-transform-runtime'), {
              helpers: false,
              regenerator: true
            }],
            require.resolve('@babel/plugin-syntax-dynamic-import')
          ]
        }
      },
      exclude: babelExclude
    });
  }

  activePlugins.push(
    new Webpack.DefinePlugin({
      'process.env': settings
    })
  );

  // add "use strict" to the very beginning of the bundle to avoid some of node4 issues
  activePlugins.push(
    new Webpack.BannerPlugin({
      banner: '"use strict";',
      raw: true
    })
  );

  // Return config.
  return {
    entry: path.join(rootPath, args.entryPoint),
    mode: 'production',
    target: 'node',
    output: {
      path: path.join(rootPath, args.destinationFolder),
      filename: `${pkg.name}.extension.${pkg.version}.js`,
      libraryTarget: 'commonjs2'
    },
    externals: externals.compatible,
    module: {
      rules: activeLoaders
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma,
            compress: {
              unused: true,
              dead_code: true
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    },
    plugins: activePlugins,
    resolve: {
      modules: [
        'node_modules',
        path.join(rootPath, './node_modules/')
      ],
      alias: { }
    }
  };
};
