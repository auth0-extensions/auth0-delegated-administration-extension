const Webtask = require('webtask-tools');

const errors = require('./errors');
const storage = require('./storage');

const tools = module.exports = { };

/*
 * Errors exposed by the library.
 */
tools.ArgumentError = errors.ArgumentError;
tools.ForbiddenError = errors.ForbiddenError;
tools.HookTokenError = errors.HookTokenError;
tools.ManagementApiError = errors.ManagementApiError;
tools.NotFoundError = errors.NotFoundError;
tools.UnauthorizedError = errors.UnauthorizedError;
tools.ValidationError = errors.ValidationError;

/*
 * Helper for the Management Api.
 */
tools.managementApi = require('./auth0/managementApi');

/*
 * Storage helpers.
 */
tools.FileStorageContext = storage.FileStorageContext;
tools.WebtaskStorageContext = storage.WebtaskStorageContext;

/*
 * Helpers that expose CRUD capablities to storage.
 */
tools.BlobRecordProvider = require('./blobRecordProvider');

/*
 * Helper that providers a configuration object containing one or more settings.
 */
tools.config = require('./config/configFactory');
tools.configProvider = require('./config/configProvider');

/*
 * Bootstrap function to run initialize a server (connect, express, ...).
 */
tools.createServer = require('./createServer').createServer;

/*
 * Validate a token for webtask hooks.
 */
tools.validateHookToken = require('./validateHookToken');

/*
 * Session.
 */
tools.SessionManager = require('./sessionManager');

/*
 * Bootstrap function to run initialize an Express server.
 */
tools.createExpressServer = function createExpressServer(cb) {
  return Webtask.fromExpress(tools.createServer(cb));
};

/*
 * Bootstrap function to run initialize a Hapi server.
 */
tools.createHapiServer = function createHapiServer(cb) {
  return Webtask.fromHapi(tools.createServer(cb));
};
