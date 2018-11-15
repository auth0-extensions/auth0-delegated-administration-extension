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
        load: (type, name, callback) => {
          this.get(type, name)
            .then((script) => {
              callback(null, script);
              return null;
            })
            .catch(callback);
        },
        hash: (type, name) => type + name,
        max: 100,
        maxAge: cacheAge
      })
    );
  }

  get(type, name) {
    return this.storage.read()
      .then((data) => {
        if (!data || !data[type]) {
          return null;
        }

        if (type === 'endpoints') {
          const endpoint = _.find(data.endpoints, { name });
          return endpoint && endpoint.handler;
        }

        return data.scripts[name];
      });
  }

  getAllEndpoints() {
    return this.storage.read()
      .then(data => (data && data.endpoints) || null);
  }

  saveEndpoint(id, name, handler) {
    return this.storage.read()
      .then((data) => {
        if (!data.endpoints) {
          data.endpoints = [];
        }

        const existing = _.findIndex(data.endpoints, { name });

        if (id === null) {
          if (data.endpoints.length >= process.env.MAX_CUSTOM_ENDPOINTS) {
            return Promise.reject(new ArgumentError(`You cannot create more than ${process.env.MAX_CUSTOM_ENDPOINTS} endpoints`));
          }

          if (existing >= 0) {
            return Promise.reject(new ArgumentError(`Endpoint with name "${name}" already exists`));
          }

          data.endpoints.push({ name, handler });
        } else {
          if (existing >= 0 && existing !== id) {
            return Promise.reject(new ArgumentError(`Endpoint with name "${name}" already exists`));
          }

          data.endpoints[id].name = name || data.endpoints[id].name;
          data.endpoints[id].handler = handler || data.endpoints[id].handler;
        }

        return this.storage.write(data);
      });
  }

  deleteEndpoint(id) {
    return this.storage.read()
      .then((data) => {
        if (!data.endpoints || !data.endpoints[id]) {
          return Promise.reject(new NotFoundError('Endpoint not found'));
        }

        data.endpoints.splice(id, 1);

        return this.storage.write(data);
      });
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
    return this.getCached('scripts', name)
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
            logger.error(`Failed to compile Delegated Admin hook (${name}): "${err}, ${script}"`);
            reject(parseScriptError(err, name));
          }
        });
      });
  }

  callEndpoint(req) {
    const name = req.params.name;

    return this.getCached('endpoints', name)
      .then((script) => {
        if (!script) {
          return null;
        }

        logger.debug(`Executing Delegated Admin custom endpoint: ${name}`);
        return new Promise((resolve, reject) => {
          try {
            const func = safeEval(script, { require: this.dynamicRequire });
            func(req, (err, res) => {
              if (err) {
                logger.error(`Failed to execute Delegated custom endpoint (${name}): "${err}"`);
                reject(parseScriptError(err, name));
              } else {
                resolve({ status: res.status || 200, body: res.body || res });
              }
            });
          } catch (err) {
            logger.error(`Failed to compile Delegated Admin custom endpoint (${name}): "${err}"`);
            reject(parseScriptError(err, name));
          }
        });
      });
  }
}
