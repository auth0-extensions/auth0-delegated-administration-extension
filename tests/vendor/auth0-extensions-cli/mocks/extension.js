const some = require('lodash');

module.exports = (context, req, res) => {
  const test = some('test string');
  return res.send(test);
};
