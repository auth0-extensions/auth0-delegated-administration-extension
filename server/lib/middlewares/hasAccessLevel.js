module.exports = (level) =>
  (req, res, next) => {
    if (req.user && req.user.access_level >= level) {
      next();
    } else {
      res.status(403);
      res.json({ error: 'Forbidden! Sorry, you have no permissions to do this.' });
    }
  };
