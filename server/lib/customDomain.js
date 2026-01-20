import { ValidationError } from 'auth0-extension-tools';
import tools from 'auth0-extension-tools';
import{ getClientOptions}  from '../lib/managementApiClient'

import config from './config';
import logger from './logger';

const DOMAIN_REGEX = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
const DOMAIN_MAX_LENGTH = 253;

/**
 * Execute custom domain selection hook and get custom domain headers
 * @param {object} req - Express request
 * @param {ScriptManager} scriptManager - Script manager instance
 * @param {string} method - Operation type: 'create', 'update', 'password-reset', 'verify-email'
 * @param {object} payload - Operation payload
 * @returns {Promise<object>} Headers object for Management API client
 */
export const getCustomDomainHeaders = async (req, scriptManager, method, payload) => {
  const context = {
    method,
    request: {
      user: req.user,
      originalUser: req.targetUser || null
    },
    payload
  };
  
  try {
    const result = await scriptManager.execute('customDomain', context);
    
    if (!result) {
      return {};
    }
    
    if (typeof result !== 'object') {
      throw new ValidationError('Custom domain hook must return an object');
    }
    
    const { customDomain, useCanonicalDomain } = result;
    
    let headerValue = null;
    
    if (customDomain) {

      if (typeof customDomain !== 'string' || customDomain.trim().length === 0) {
        throw new ValidationError('customDomain must be a non-empty string');
      }
      
      if (customDomain.length > DOMAIN_MAX_LENGTH || !DOMAIN_REGEX.test(customDomain)) {
        throw new ValidationError('customDomain format is not valid');
      }
      
      headerValue = customDomain;
      
    } else if (useCanonicalDomain === true) {

      headerValue = config('AUTH0_DOMAIN');
      
    }
    
    if (headerValue) {
      return {
        'auth0-custom-domain': headerValue
      };
    }
    
    return {};
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error(`Custom domain hook validation error: ${error.message}`);
      
    }
    
    logger.error(`Custom domain hook execution failed: ${error.message}`);
    throw error
  }
};

/**
 * Get Auth0 Management API client with custom domain headers
 * @param {object} req - Express request
 * @param {object} customHeaders - Custom headers to include
 * @returns {Promise<ManagementClient>} Auth0 Management API client with custom headers
 */
const getClientWithHeaders = async (req, customHeaders) => {  
  return tools.managementApi.getClient(getClientOptions(req, customHeaders));
};

/**
 * Execute Management API operation with custom domain support
 * @param {object} req - Express request
 * @param {ScriptManager} scriptManager - Script manager instance
 * @param {string} method - Hook method type
 * @param {object} payload - Operation payload
 * @param {Function} operation - Function that performs the API operation, receives (client, payload)
 * @returns {Promise<any>} Result from the operation
 */
export const executeWithCustomDomain = async (req, scriptManager, method, payload, operation) => {
  const customHeaders = await getCustomDomainHeaders(req, scriptManager, method, payload);
  
  if (Object.keys(customHeaders).length === 0) {
    return operation(req.auth0, payload);
  }
  
  const client = await getClientWithHeaders(req, customHeaders);
  return operation(client, payload);
};
