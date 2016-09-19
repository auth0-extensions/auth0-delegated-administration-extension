import Promise from 'bluebird';
import safeEval from 'safe-eval';
import memoizer from 'lru-memoizer';
import { ArgumentError } from 'auth0-extension-tools';

import parseScriptError from './errors/parseScriptError';

export default class ScriptManager {
  constructor(storage) {
    if (storage === null || storage === undefined) {
      throw new ArgumentError('Must provide a storage object.');
    }

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
        hash: (name) => name,
        max: 100,
        maxAge: 1000 * 10
      })
    );
  }

  get(name) {
    return this.storage.read()
      .then(data => {
        if (!data || !data.scripts) {
          return null;
        }

        return data.scripts[name];
      });
  }

  save(name, script) {
    return this.storage.read()
      .then(data => {
        data.scripts[name] = script;
        return data;
      })
      .then(data => this.storage.write(data));
  }

  execute(name, ctx) {
    return this.getCached(name)
      .then(script => {
        if (!script) {
          return null;
        }

        return new Promise((resolve, reject) => {
          try {
            const func = safeEval(script);
            func(ctx, (err, res) => {
              if (err) {
                reject(parseScriptError(err, name));
              } else {
                resolve(res);
              }
            });
          } catch (err) {
            reject(parseScriptError(err, name));
          }
        });
      });
  }
}
