import vm from 'vm';
import Promise from 'bluebird';
import memoizer from 'lru-memoizer';
import { ArgumentError } from '../../vendor/auth0-extension-tools';

import logger from './logger';
import parseScriptError from './errors/parseScriptError';


function evalScript(code, context) {
  const sandbox = {};
  const resultKey = 'SAFE_EVAL_RESULT';

  const clearContext = `
    (function(){
      Function = undefined;
      const keys = Object.getOwnPropertyNames(this).concat(['constructor']);
      keys.forEach((key) => {
        const item = this[key];
        if (!item || typeof item.constructor !== 'function') return;
        this[key].constructor = undefined;
      });
    })();
  `;

  if (context) {
    Object.keys(context).forEach((key) => {
      sandbox[key] = context[key];
    });
  }

  vm.runInNewContext(`${clearContext}${resultKey} = (${code})`, sandbox);
  return sandbox[resultKey];
}

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
    } catch {
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
            const func = evalScript(script, { require: this.dynamicRequire });
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
}
