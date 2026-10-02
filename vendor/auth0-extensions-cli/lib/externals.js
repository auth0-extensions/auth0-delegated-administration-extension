const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const glob = require('glob');
const async = require('async');
const semver = require('semver');
const request = require('superagent');
const Promise = require('bluebird');

const LIST_MODULES_URL = 'https://auth0-internal.us8.webtask.io/canirequire';

module.exports = searchPath =>
  new Promise((resolve, reject) => {
    request
      .get(LIST_MODULES_URL)
      .query({ json: true })
      .then((res) => {
        const data = res.body;
        const webtaskModules = _.orderBy(data.modules, ['name', 'version'], ['asc', 'desc']);

        glob('**/package.json', { cwd: searchPath }, (err, matches) => {
          async.map(
            matches,
            (file, cb) => fs.readFile(path.join(searchPath, file), 'utf8', cb),
            (readErr, results) => {
              if (readErr) {
                return reject(readErr);
              }

              // Flatten all dependencies.
              const allDependencies = results.map(file => JSON.parse(file).dependencies);
              const dependencyTree = _.reduce(
                allDependencies,
                (output, dependencies) => {
                  _.keys(dependencies).forEach((moduleName) => {
                    const version = dependencies[moduleName];
                    const versions = output[moduleName] || [];
                    if (versions.indexOf(version) === -1) {
                      versions.push(version);
                    }
                    output[moduleName] = versions;
                  });
                  return output;
                },
                {}
              );

              // Calculate externals.
              const externals = _.reduce(
                dependencyTree,
                (output, versions, moduleName) => {
                  const modules = _.filter(webtaskModules, module => module.name === moduleName && module.version !== 'native');
                  if (!versions || versions.length !== 1 || _.isEmpty(modules)) {
                    output.incompatible[moduleName] = {
                      local: versions,
                      webtask: 'N/A'
                    };
                    return output;
                  }

                  const webtaskModule = _.find(modules, module => semver.satisfies(module.version, versions[0]));
                  if (webtaskModule) {
                    output.compatible[moduleName] = `${moduleName}@${webtaskModule.version}`;
                  } else {
                    output.incompatible[moduleName] = {
                      local: versions,
                      webtask: _.map(modules, 'version')
                    };
                  }

                  return output;
                },
                { compatible: {}, incompatible: {} }
              );
              return resolve(externals);
            }
          );
        });
      })
      .catch(reject);
  });
