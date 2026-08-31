const tools = require('auth0-extension-tools');

module.exports = function(handlerOptions) {
  return function(req, res, next) {
    const request = req;
    const isAdministrator = req.user && req.user.access_token && req.user.access_token.length;
    const options = !isAdministrator ? handlerOptions : {
      domain: handlerOptions.domain,
      accessToken: req.user.access_token,
      headers: handlerOptions.headers
    };

    tools.managementApi.getClient(options)
      .then(function(auth0) {
        request.auth0 = auth0;
        next();
        return null;
      })
      .catch(function(err) {
        next(err);
      });
  };
};
