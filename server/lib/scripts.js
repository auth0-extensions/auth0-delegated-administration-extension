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
          convertedFunction = null;
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

module.exports.checkAccess = (req, chosenUser) =>
  getScript(req.storage, 'access')
    .then(script => {
      if (script && !script(req.user, chosenUser)) {
        return false;
      }

      return chosenUser;
    });

module.exports.prepareUser = (req, res, next) =>
  getScript(req.storage, 'write')
    .then(script => {
      if (script) {
        script(req.user, req.body);
      }

      next();
    });

module.exports.updateFilter = (req) =>
  getScript(req.storage, 'filter')
    .then(script => {
      let query = req.query.search || '';

      if (script && script(req.user)) {
        const filter = script(req.user);
        query = (query) ? `(${query}) AND ${filter}` : filter;
      }

      return query;
    });

