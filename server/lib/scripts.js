import Promise from 'bluebird';

module.exports.getAllScripts = (storage) => {
  storage.read()
    .then(data => Promise.resolve(data.scripts || { access: '', filter: '', write: '', memberships: '' }))
    .catch(err => Promise.reject(err));
};

module.exports.getScript = (storage, name) => {
  storage.read()
    .then(data => Promise.resolve((data.scripts && data.scripts[name]) ? data.scripts[name] : ''))
    .catch(err => Promise.reject(err));
};

module.exports.setScripts = (storage, scripts) => {
  storage.read()
    .then(data => {
      const newData = data;

      newData.scripts = {
        access: scripts.access,
        filter: scripts.filter,
        write: scripts.write,
        memberships: scripts.memberships
      };
      return newData;
    })
    .then(data => storage.write(data))
    .then((data) => Promise.resolve(data.scripts || { access: '', filter: '', write: '', memberships: '' }))
    .catch(err => Promise.reject(err));
};
