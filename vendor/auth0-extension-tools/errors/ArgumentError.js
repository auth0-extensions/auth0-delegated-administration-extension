function ArgumentError(message) {
  Error.call(this, message);
  if (process.env.NODE_ENV !== 'production') {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = 'ArgumentError';
  this.message = message;
  this.status = 400;
}

ArgumentError.prototype = Object.create(Error.prototype);
ArgumentError.prototype.constructor = ArgumentError;
module.exports = ArgumentError;
