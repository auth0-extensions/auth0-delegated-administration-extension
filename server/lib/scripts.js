import Promise from 'bluebird';
import safeEval from 'safe-eval';

import logger from './logger';

const getScript = (storage, name) =>
  storage.read()
    .then(data => {
      const textFunction = (data.scripts && data.scripts[name]) ? data.scripts[name] : null;
      let convertedFunction;

      if (textFunction) {
        try {
          convertedFunction = safeEval(textFunction);
        } catch (err) {
          logger.error(`Custom script "${name}" error:`);
          logger.error(err);
          return Promise.reject(err);
        }
      }

      return Promise.resolve(convertedFunction);
    })
    .catch(err => Promise.reject(err));

module.exports.getScript = getScript;

module.exports.getAllScripts = (storage) =>
  storage.read()
    .then(data => Promise.resolve(data.scripts || { access: '', filter: '', write: '', memberships: '', styles: '' }))
    .catch(err => Promise.reject(err));

module.exports.setScripts = (storage, scripts) =>
  storage.read()
    .then(data => {
      const newData = data;

      newData.scripts = {
        access: scripts.access,
        filter: scripts.filter,
        write: scripts.write,
        memberships: scripts.memberships,
        styles: scripts.styles
      };

      return newData;
    })
    .then(data => storage.write(data))
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(err));

module.exports.setScript = (storage, script, name) =>
  storage.read()
    .then(data => {
      const newData = data;
      newData.scripts = newData.scripts || {};
      newData.scripts[name] = script;

      return newData;
    })
    .then(data => storage.write(data))
    .then(() => Promise.resolve())
    .catch(err => Promise.reject(err));

module.exports.getCustomData = (name, defaults) =>
  (req, res, next) => {
    getScript(req.storage, name)
      .then(script => {
        if (script) {
          try {
            script(req.user, (err, data) => {
              if (err) {
                next(err);
              }

              res.json(data || defaults);
            });
          } catch (err) {
            next(err);
          }
        } else {
          res.json({});
        }
      })
      .catch(next);
  };
