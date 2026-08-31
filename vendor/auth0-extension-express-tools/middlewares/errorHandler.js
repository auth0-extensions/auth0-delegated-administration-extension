module.exports = function(errorLogger) {
  return function(err, req, res, next) { // eslint-disable-line no-unused-vars
    if (errorLogger) {
      errorLogger(err);
    }

    if (err && err.status) {
      res.status(err.status);
      return res.json({
        error: err.code || err.name,
        message: err.message || err.name
      });
    }

    res.status(err.status || 500);
    if (process.env.NODE_ENV === 'production') {
      return res.json({
        error: 'InternalServerError',
        message: err.message || err.name
      });
    }

    return res.json({
      error: 'InternalServerError',
      message: err.message || err.name,
      details: {
        message: err.message,
        status: err.status,
        stack: err.stack
      }
    });
  };
};
