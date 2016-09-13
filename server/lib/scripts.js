import Promise from 'bluebird';
import safeEval from 'safe-eval';

import logger from './logger';

const logScriptError = (storage, name, error) => {
  logger.error(`Custom script "${name}" error:`);
  logger.error(error);

  storage.read().then(data => {
    const newData = data;

    newData.info = data.info || {};
    newData.info[name] = newData.info[name] || { log: [] };
    newData.info[name].status = 1;

    if (newData.info[name].log.length > 4) {
      newData.info[name].log.pop();
    }

    newData.info[name].log.unshift({ name: error.name, message: error.message });

    storage.write(newData);
  });
};

const getScript = (storage, name) =>
  storage.read()
    .then(data => {
      const textFunction = (data.scripts && data.scripts[name]) ? data.scripts[name] : null;
      let convertedFunction;

      if (textFunction) {
        try {
          convertedFunction = safeEval(textFunction);
        } catch (err) {
          logScriptError(storage, name, err);
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
      newData.info = newData.info || {};
      newData.scripts[name] = script;
      newData.info[name] = newData.info[name] || { log: [] };
      newData.info[name].status = 0;

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

              switch (name) {
                case 'styles':
                  res.json(data);
                  break;

                case 'memberships':
                  res.json({ memberships: data || defaults, role: req.user.role || 0 });
                  break;

                default:
                  throw new Error('Wrong customData name. Use "styles" or "memberships"');
              }
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
