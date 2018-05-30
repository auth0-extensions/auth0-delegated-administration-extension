export default (errorLogger) =>
  (err, req, res, next) => {
    if (errorLogger) {
      errorLogger(err);
    }

    if (err && (err.status || err.statusCode)) {
      res.status(err.status || err.statusCode);
      return res.json({
        error: err.code || err.name,
        message: err.message || err.name
      });
    }

    res.status(500);
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
