const _ = require('lodash');
const fs = require('fs');
const Promise = require('bluebird');

const ArgumentError = require('../errors').ArgumentError;

/**
 * Create a new FileStorageContext.
 * @param {string} path The full path to the file.
 * @param {Object} options The options object.
 * @param {boolean} options.mergeWrites Merge the data from the local file with the new payload when writing a file.
 *     (defaults to `true` if options is not defined).
 * @param {Object} options.defaultData The default data to use when the file does not exist or is empty.
 * @constructor
 */
function FileStorageContext(path, options) {
  if (path === null || path === undefined) {
    throw new ArgumentError('Must provide the path to the file');
  }

  if (typeof path !== 'string' || path.length === 0) {
    throw new ArgumentError('The provided path is invalid: ' + path);
  }

  options = options || { mergeWrites: true };

  this.path = path;
  this.mergeWrites = options.mergeWrites;
  this.defaultData = options.defaultData || {};
}

/**
 * Read payload from the file.
 * @return {object} The object parsed from the file.
 */
FileStorageContext.prototype.read = function() {
  const ctx = this;
  return new Promise(function readFileStorageContext(resolve, reject) {
    fs.readFile(ctx.path, 'utf8', function(err, data) {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(ctx.defaultData);
        }

        return reject(err);
      }
      try {
        if (data && data.length) {
          return resolve(JSON.parse(data));
        }

        return resolve(ctx.defaultData);
      } catch (e) {
        return reject(e);
      }
    });
  });
};

/**
 * Write payload to the file.
 * @param {object} payload The object to write.
 */
FileStorageContext.prototype.write = function(payload) {
  const ctx = this;
  var writePromise = Promise.resolve(payload);

  if (ctx.mergeWrites) {
    writePromise = writePromise.then(function(data) {
      return ctx.read()
        .then(function(originalData) {
          return _.extend({ }, originalData, data);
        });
    });
  }

  return writePromise.then(function(data) {
    return new Promise(function(resolve, reject) {
      try {
        return fs.writeFile(ctx.path, JSON.stringify(data, null, 2), 'utf8', function(err) {
          if (err) {
            return reject(err);
          }

          return resolve();
        });
      } catch (e) {
        return reject(e);
      }
    });
  });
};

/**
 * Module exports.
 * @type {function}
 */
module.exports = FileStorageContext;
