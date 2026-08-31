const async = require('async');

module.exports = function() {
  const queue = async.queue(function(task, callback) {
    task()
      .then(function(res) {
        callback(null, res);
      })
      .catch(function(err) {
        callback(err);
      });
  }, 1);
  return queue.push.bind(queue);
};
