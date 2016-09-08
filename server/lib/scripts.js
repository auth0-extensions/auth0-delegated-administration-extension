import Promise from 'bluebird';
import safeEval from 'safe-eval';

import logger from './logger';

module.exports.getAllScripts = (storage) =>
  storage.read()
    .then(data => Promise.resolve(data.scripts || { access: '', filter: '', write: '', memberships: '', styles: '' }))
    .catch(err => Promise.reject(err));


module.exports.getScript = (storage, name) =>
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
    .then((data) => Promise.resolve(data.scripts || { access: '', filter: '', write: '', memberships: '', styles: '' }))
    .catch(err => Promise.reject(err));

