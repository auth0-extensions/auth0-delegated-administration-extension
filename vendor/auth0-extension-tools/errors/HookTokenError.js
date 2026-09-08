function HookTokenError(message, innerError) {
  Error.call(this, message);
  if (process.env.NODE_ENV !== 'production') {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = 'HookTokenError';
  this.message = message;
  this.status = 401;
  this.innerError = innerError;
}

HookTokenError.prototype = Object.create(Error.prototype);
HookTokenError.prototype.constructor = HookTokenError;
module.exports = HookTokenError;
