const Promise = require('bluebird');

const ArgumentError = require('../errors').ArgumentError;

/**
 * Create a new WebtaskStorageContext.
 * @param {Object} storage The Webtask storage object.
 * @param {Object} options The options object.
 * @param {int} options.force Disregard the possibility of a conflict.
 * @param {Object} options.defaultData The default data to use when the file does not exist or is empty.
 * @constructor
 */
function WebtaskStorageContext(storage, options) {
  if (storage === null || storage === undefined) {
    throw new ArgumentError('Must provide the Webtask storage object');
  }

  options = options || { force: 1 };

  this.storage = storage;
  this.options = options;
  this.defaultData = options.defaultData || {};
}

/**
 * Read payload from Webtask storage.
 * @return {object} The object parsed from Webtask storage.
 */
WebtaskStorageContext.prototype.read = function() {
  const ctx = this;
  return new Promise(function readWebtaskStorageContext(resolve, reject) {
    ctx.storage.get(function(err, data) {
      if (err) {
        return reject(err);
      }

      return resolve(data || ctx.defaultData);
    });
  });
};

/**
 * Write data to Webtask storage.
 * @param {object} data The object to write.
 */
WebtaskStorageContext.prototype.write = function(data) {
  const ctx = this;
  return new Promise(function(resolve, reject) {
    ctx.storage.set(data, ctx.options, function(err) {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

/**
 * Perform retries on write if a webtask storage conflict is detected.
 * @param {object} err The write error to examine.
 */
WebtaskStorageContext.prototype.writeRetryCondition = function(err) {
  return err.code === 409;
};

/**
 * Module exports.
 * @type {function}
 */
module.exports = WebtaskStorageContext;
