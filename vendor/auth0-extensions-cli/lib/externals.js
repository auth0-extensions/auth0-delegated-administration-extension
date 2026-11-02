const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { glob } = require('glob');
const async = require('async');
const semver = require('semver');
const request = require('superagent');
const Promise = require('bluebird');

const LIST_MODULES_URL = 'https://auth0-internal.us8.webtask.io/canirequire';
const DEFAULT_RUNTIME = 'node22';

class CanirequireNetworkError extends Error {
  constructor(cause) {
    const reason = cause.code || (cause.status && `HTTP ${cause.status}`) || cause.message;
    super(`Network failure: unable to check available external module versions in canirequire (${reason})`);
    this.name = 'CanirequireNetworkError';
  }
}

const fetchRuntimeModules = (runtime, url = LIST_MODULES_URL) =>
  request
    .get(url)
    .set('X-Wt-Runtime', runtime)
    .query({ json: true })
    .then(res => res.body)
    .catch((err) => { throw new CanirequireNetworkError(err); });

// Splits `name@version`, `@scope/name@version`, or a bare `name` (version is then null).
const parseSpec = (spec) => {
  const at = spec.lastIndexOf('@');
  return at > 0 ? { name: spec.slice(0, at), version: spec.slice(at + 1) } : { name: spec, version: null };
};

/*
 * Check explicit externals (`name@version`) against the modules the webtask runtime provides.
 * Resolves with every entry that isn't available, so all problems can be reported at once.
 */
const findMissingExternals = (specs, runtime = DEFAULT_RUNTIME, url = LIST_MODULES_URL) =>
  fetchRuntimeModules(runtime, url).then((data) => {
    const available = _.mapValues(_.groupBy(data.modules, 'name'), modules => _.map(modules, 'version'));

    const missing = specs
      .map(spec => Object.assign({ spec }, parseSpec(spec)))
      .filter(({ name, version }) => !available[name] || (version !== null && !available[name].includes(version)))
      .map(({ spec, name }) => ({ spec, available: available[name] || [] }));

    return { nodeVersion: data.node_version, missing };
  });

const getExternals = (searchPath, runtime = DEFAULT_RUNTIME) =>
  new Promise((resolve, reject) => {
    request
      .get(LIST_MODULES_URL)
      .set('X-Wt-Runtime', runtime)
      .query({ json: true })
      .then((res) => {
        const data = res.body;
        const webtaskModules = _.orderBy(data.modules, ['name', 'version'], ['asc', 'desc']);

        glob('**/package.json', { cwd: searchPath }).then((matches) => {
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
        }).catch(reject);
      })
      .catch(reject);
  });

module.exports = getExternals;
module.exports.findMissingExternals = findMissingExternals;
module.exports.CanirequireNetworkError = CanirequireNetworkError;
