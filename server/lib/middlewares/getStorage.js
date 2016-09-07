import path from 'path';
import tools from 'auth0-extension-tools';

module.exports = (req, res, next) => {
  const request = req;
  request.storage = (req.webtaskContext && req.webtaskContext.storage)
    ? new tools.WebtaskStorageContext(req.webtaskContext.storage, { force: 1 })
    : new tools.FileStorageContext(path.join(__dirname, '../../data.json'), { mergeWrites: true });

  next();
};
