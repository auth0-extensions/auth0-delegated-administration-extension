import logger from '../logger';

module.exports = (err, req, res) => {
  logger.error(err);

  if (err && err.name === 'ValidationError') {
    res.status(400);
    return res.json({ error: err.message });
  }

  if (err && err.name === 'NotFoundError') {
    res.status(404);
    return res.json({ error: err.message });
  }

  const message = { message: err.message };

  if (process.env.NODE_ENV !== 'production') {
    message.error = {
      message: err.message,
      status: err.status,
      stack: err.stack
    };
  }

  res.status(err.status || 500);
  return res.json(message);
};
