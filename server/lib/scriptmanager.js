import _ from 'lodash';
import Promise from 'bluebird';
import safeEval from 'safe-eval';
import memoizer from 'lru-memoizer';
import { ArgumentError, NotFoundError } from 'auth0-extension-tools';

import logger from './logger';
import parseScriptError from './errors/parseScriptError';

export default class ScriptManager {
  constructor(storage, cacheAge = 1000 * 10) {
    if (storage === null || storage === undefined) {
      throw new ArgumentError('Must provide a storage object.');
    }

    this.log = logger.debug.bind(logger);
    this.cache = { };
    this.storage = storage;
    this.getCached = Promise.promisify(
      memoizer({
        load: (name, callback) => {
          this.get(name)
            .then((script) => {
              callback(null, script);
              return null;
            })
            .catch(callback);
        },
        hash: name => name,
        max: 100,
        maxAge: cacheAge
      })
    );
    this.getEndpointCached = Promise.promisify(
      memoizer({
        load: (name, method, callback) => {
          this.getEndpoint(name, method)
            .then((script) => {
              callback(null, script);
              return null;
            })
            .catch(callback);
        },
        hash: name => name,
        max: 100,
        maxAge: cacheAge
      })
    );
  }

  get(name) {
    return this.storage.read()
      .then((data) => {
        if (!data || !data.scripts) {
          return null;
        }

        return data.scripts[name];
      });
  }

  getEndpoint(name, method) {
    return this.storage.read()
      .then((data) => {
        if (!data || !data.endpoints) {
          return null;
        }

        return _.find(data.endpoints, { name, method });
      });
  }

  getAllEndpoints() {
    return this.storage.read()
      .then(data => (data && data.endpoints) || null);
  }

  createEndpoint(name, method, handler) {
    return this.storage.read()
      .then((data) => {
        if (!data.endpoints) {
          data.endpoints = [];
        }

        if (_.find(data.endpoints, { name })) {
          return Promise.reject(new ArgumentError(`Endpoint with name "${name}" already exists`));
        }

        data.endpoints.push({ name, method, handler });
        return data;
      })
      .then(data => this.storage.write(data));
  }

  updateEndpoint(id, name, method, handler) {
    return this.storage.read()
      .then((data) => {
        if (!data.endpoints || !data.endpoints[id]) {
          return Promise.reject(new NotFoundError(`Endpoint "${name}" not found`));
        }

        data.endpoints[id].name = name || data.endpoints[id].name;
        data.endpoints[id].method = method || data.endpoints[id].method;
        data.endpoints[id].handler = handler || data.endpoints[id].handler;

        return data;
      })
      .then(data => this.storage.write(data));
  }

  deleteEndpoint(id) {
    return this.storage.read()
      .then((data) => {
        if (!data.endpoints || !data.endpoints[id]) {
          return Promise.reject(new NotFoundError('Endpoint not found'));
        }

        data.splice(id, 1);

        return data;
      })
      .then(data => this.storage.write(data));
  }

  save(name, script) {
    return this.storage.read()
      .then((data) => {
        if (!data.scripts) {
          data.scripts = {};
        }

        data.scripts[name] = script;
        return data;
      })
      .then(data => this.storage.write(data));
  }

  readCustomData() {
    return this.storage.read()
      .then(data => data.customData || { });
  }

  writeCustomData(customData) {
    return this.storage.read()
      .then((data) => {
        data.customData = customData;
        return data;
      })
      .then(data => this.storage.write(data));
  }

  createContext(ctx) {
    return {
      log: this.log,
      global: this.cache,
      read: this.readCustomData.bind(this),
      write: this.writeCustomData.bind(this),
      ...ctx
    };
  }

  dynamicRequire(module) {
    try {
      return __non_webpack_require__(module);
    } catch(e) {
      // silently ignore and then try require
    }

    return require(module);
  }

  execute(name, ctx) {
    return this.getCached(name)
      .then((script) => {
        if (!script) {
          return null;
        }

        logger.debug(`Executing Delegated Admin hook: ${name}`);
        return new Promise((resolve, reject) => {
          try {
            const func = safeEval(script, { require: this.dynamicRequire });
            func(this.createContext(ctx), (err, res) => {
              if (err) {
                logger.error(`Failed to execute Delegated Admin hook (${name}): "${err}"`);
                reject(parseScriptError(err, name));
              } else {
                resolve(res);
              }
            });
          } catch (err) {
            logger.error(`Failed to compile Delegated Admin hook (${name}): "${err}"`);
            reject(parseScriptError(err, name));
          }
        });
      });
  }

  callEndpoint(req) {
    const method = req.method.toUpperCase();
    const name = req.params.name;

    return this.getEndpointCached(name, method)
      .then((script) => {
        if (!script) {
          return null;
        }

        logger.debug(`Executing Delegated Admin custom endpoint: ${method} ${name}`);
        return new Promise((resolve, reject) => {
          try {
            const func = safeEval(script, { require: this.dynamicRequire });
            func(req, (err, res) => {
              if (err) {
                logger.error(`Failed to execute Delegated custom endpoint (${method} ${name}): "${err}"`);
                reject(parseScriptError(err, name));
              } else {
                resolve({ status: res.status || 200, body: res.body || res });
              }
            });
          } catch (err) {
            logger.error(`Failed to compile Delegated Admin custom endpoint (${method} ${name}): "${err}"`);
            reject(parseScriptError(err, name));
          }
        });
      });
  }
}
