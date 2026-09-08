const server = require('./server');
const urlHelpers = require('./urlHelpers');
const middlewares = require('./middlewares');
const routes = require('./routes');

/*
 * Bootstrap function to run initialize an Express server.
 */
module.exports.createServer = server.createServer;

/*
 * Helpers to figure out the full url and the base path based on the request
 */
module.exports.urlHelpers = urlHelpers;

/*
 * Useful middlewares
 */
module.exports.middlewares = middlewares;

/*
 * Route bundles.
 */
module.exports.routes = routes;
