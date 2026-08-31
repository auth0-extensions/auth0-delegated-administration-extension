function ManagementApiError(code, message, status) {
  Error.call(this, message);
  if (process.env.NODE_ENV !== 'production') {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = 'ManagementApiError';
  this.code = code;
  this.message = message;
  this.status = status || 400;
}

ManagementApiError.prototype = Object.create(Error.prototype);
ManagementApiError.prototype.constructor = ManagementApiError;
module.exports = ManagementApiError;
