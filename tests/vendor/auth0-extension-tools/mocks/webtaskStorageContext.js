const webtaskStorage = require('../mocks/webtaskStorage');
const WebtaskStorageContext = require('../../storage/webtaskStorageContext');

module.exports = function(onDataChanged, beforeDataChanged) {
  const data = {
    applications: [
      { _id: 'a1', name: 'a1' }
    ],
    users: [
      { _id: 1, name: 'John' },
      { _id: 23, name: 'Jane' }
    ]
  };

  const storage = webtaskStorage(data, onDataChanged, beforeDataChanged);
  return new WebtaskStorageContext(storage);
};
