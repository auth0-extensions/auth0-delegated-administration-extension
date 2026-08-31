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
