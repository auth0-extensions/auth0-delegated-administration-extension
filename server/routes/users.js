import _ from 'lodash';
import auth0 from 'auth0';
import request from 'request';
import Promise from 'bluebird';
import { Router } from 'express';
import { ArgumentError, ValidationError, UnauthorizedError } from 'auth0-extension-tools';

import config from '../lib/config';
import logger from '../lib/logger';
import { verifyUserAccess } from '../lib/middlewares';
import { removeGuardian, requestGuardianEnrollments } from '../lib/removeGuardian';
import { requestUserBlocks, removeUserBlocks } from '../lib/userBlocks';
import getApiToken from '../lib/getApiToken';
import getConnectionIdByName from '../lib/getConnectionIdByName';

const isValidField = (type, onlyTheseFields, field) =>
  ((onlyTheseFields && _.includes(onlyTheseFields, field.property)) || (!onlyTheseFields && field[type] !== false));

const checkCustomFieldValidation = (req, context, isEditRequest, onlyTheseFields) => {
  /* Exit early if no custom fields */
  if (!context.userFields) return context.payload;

  const requiredErrorText = (req.query && req.query.requiredErrorText) || 'required';

  const type = isEditRequest ? 'edit' : 'create';

  /* Loop through valid fields and apply validation function */
  const ignoredFields = _.map(_.filter(context.userFields, field => !isValidField(type, onlyTheseFields, field)), 'property');
  const fieldsToValidate = _.filter(context.userFields, field => !_.includes(ignoredFields, field.property) && _.isObject(field[type]) && (field[type].required || field[type].validationFunction));

  const errorList = {};
  fieldsToValidate.forEach((field) => {
    const value = _.get(context.payload, field.property);
    const errorKey = field.label || field.property;
    if (!value || value.length === 0) {
      if (field[type].required) {
        errorList[errorKey] = [ requiredErrorText || 'required' ];
      }
      return;
    }

    if (field[type].validationFunction) {
      try {
        const validationFunction = eval(`(${field[type].validationFunction})`);
        if (!_.isFunction(validationFunction)) {
          logger.warn(`warning: skipping invalid validation function: ${field[type].validationFunction}, because: it is not a function`);
        } else {
          const error = validationFunction(value, context.payload);
          if (error) {
            errorList[errorKey] = error;
            return;
          }
        }
      } catch (e) {
        logger.warn(`warning: skipping invalid validation function: ${field[type].validationFunction}, because: `, e.message);
      }
    }

    if (field[type].options) {
      const optionValue = _.isObject(value) ? value.value : value;
      const options = _.map(field[type].options, option => (_.isObject(option) ? option.value : option));
      if (options.indexOf(optionValue) < 0) {
        errorList[errorKey] = `${optionValue} is not an allowed option`;
        return;
      }
    }
  });

  if (Object.keys(errorList).length > 0) throw new ValidationError(_.map(errorList, (value, index) => `${index}: ${value}`).join('\n'));

  /* remove fields from payload that have [type] false */
  if (onlyTheseFields) {
    const oldPayload = _.cloneDeep(context.payload);
    context.payload = {};
    onlyTheseFields.forEach(key => {
      _.set(context.payload, key, _.get(oldPayload, key));
    });
  }

  return _.omit(context.payload, ignoredFields);
};

const executeWriteHook = (req, scriptManager, userFields, onlyTheseFields) => {
  const user = req.targetUser;
  const context = {
    method: 'update',
    request: {
      user: req.user,
      originalUser: user
    },
    payload: req.body,
    userFields
  };

  try {
    context.payload = checkCustomFieldValidation(req, context, true, onlyTheseFields);
  } catch (e) {
    return Promise.reject(e);
  }

  return scriptManager.execute('create', context);
};

export default (storage, scriptManager) => {
  const api = Router();

  /*
   * Create user.
   */
  api.post('/', (req, res, next) => {
    const settingsContext = {
      request: {
        user: req.user
      },
      locale: req.headers['dae-locale']
    };

    scriptManager.execute('settings', settingsContext)
      .then((settings) => {
        settings = settings || {};
        const userFields = settings.userFields;
        const createContext = {
          method: 'create',
          request: {
            user: req.user
          },
          payload: req.body,
          defaultPayload: {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            connection: req.body.connection,
            app_metadata: (req.body.memberships && req.body.memberships.length && { memberships: req.body.memberships }) || {}
          },
          userFields
        };

        const canCreateUser = settings.canCreateUser !== undefined ? settings.canCreateUser: true;
        if (canCreateUser === false) {
          return next(new UnauthorizedError('Create user is forbidden'));
        }

        const repeatPasswordField = _.find(userFields, { property: 'repeatPassword' });
        if (!repeatPasswordField) {
          if (req.body.repeatPassword !== req.body.password) {
            return next(new ValidationError('The passwords do not match.'));
          }
        }

        try {
          createContext.payload = checkCustomFieldValidation(req, createContext);
        } catch (e) {
          return next(e);
        }

        // Remove repeatPassword before trying to update the user, it has served its purpose
        delete createContext.payload.repeatPassword;

        return scriptManager.execute('create', createContext)
          .then((payload) => {
            // need to preserve the original behavior for null create scripts
            payload = payload || createContext.defaultPayload;
            if (!payload.email || payload.email.length === 0) {
              throw new ValidationError('The email address is required.');
            }

            return payload;
          })
          .then(payload => req.auth0.users.create(payload))
          .then(() => res.status(201).send())
          .catch(next);
      });
  });

  /*
   * Get all users.
   */
  api.get('/', (req, res, next) => {
    const filterContext = {
      request: {
        user: req.user
      },
      payload: {
        search: req.query.search,
        filterBy: req.query.filterBy
      }
    };

    const searchEngine = (config('AUTH0_RTA').replace('https://', '') !== 'auth0.auth0.com') ? 'v2' : 'v3';
    const quoteChar = searchEngine === 'v2' ? '"' : '';
    let searchQuery = req.query.search;

    if (req.query.filterBy && req.query.filterBy.length > 0) {
      searchQuery = `${req.query.filterBy}:${quoteChar}${req.query.search}${quoteChar}`;
    }

    const sort = req.query.sortProperty && req.query.sortOrder
      ? `${req.query.sortProperty}:${req.query.sortOrder}`
      : 'last_login:-1';

    scriptManager.execute('filter', filterContext)
      .then((filter) => {
        const filterQuery = (filter && typeof filter.query !== 'undefined') ? filter.query : filter;
        const options = {
          sort,
          q: (searchQuery && filterQuery) ? `(${searchQuery}) AND ${filterQuery}` : searchQuery || filterQuery,
          per_page: req.query.per_page || 10,
          page: req.query.page || 0,
          include_totals: true,
          fields: 'user_id,username,name,email,identities,picture,last_login,logins_count,multifactor,blocked,app_metadata,user_metadata',
          search_engine: searchEngine
        };

        return req.auth0.users.getAll(options);
      })
      .then(data =>
        Promise.map(data.users, (user, index) =>
          scriptManager.execute('access', { request: { user: req.user }, payload: { user, action: 'read:user' } })
            .then((parsedUser) => {
              data.users[index] = parsedUser || user;
            }))
          .then(() => data))
      .then(users => res.json(users))
      .catch(err => next(err));
  });

  /*
   * Get a single user.
   */
  api.get('/:id', verifyUserAccess('read:user', scriptManager), (req, res, next) => {
    const user = req.targetUser;
    const membershipContext = {
      request: {
        user: req.user
      },
      payload: {
        user
      }
    };

    return scriptManager.execute('memberships', membershipContext)
      .then((result) => {
        if (result && Array.isArray(result)) {
          return {
            user,
            memberships: result
          };
        }

        if (result && result.memberships) {
          return {
            user,
            memberships: result.memberships
          };
        }

        return {
          user,
          memberships: []
        };
      })
      .then((data) => {
        if (!data.user.identities) {
          data.connection = {};
          return data;
        }

        const identities = data.user.identities.filter(identity => identity.provider === 'auth0');
        const name = identities[0] && identities[0].connection;

        if (!name) {
          data.connection = {};
          return data;
        }

        data.user.connection = name;

        return getConnectionIdByName(req.auth0, name)
          .then((connectionId) => {
            if (connectionId) {
              return req.auth0.connections.get({ id: connectionId, fields: 'enabled_clients' });
            }

            return {};
          })
          .then((connection) => {
            data.connection = {
              enabled_clients: connection.enabled_clients
            };

            return data;
          });
      })
      .then(data =>
        getApiToken(req)
          .then(accessToken =>
            requestUserBlocks(accessToken, req.params.id)
              .then((blockedFor) => {
                if (blockedFor) data.user.blocked_for = blockedFor;
                return accessToken;
              }))
          .then((accessToken) => {
            const checkGuardian = !!data.user.multifactor_last_modified
              || (data.user.multifactor && data.user.multifactor.indexOf('guardian') >= 0);
            if (checkGuardian) {
              return requestGuardianEnrollments(accessToken, req.params.id)
                .then((enrollments) => {
                  if (data.user.multifactor && (!enrollments || !enrollments.length)) {
                    data.user.multifactor = data.user.multifactor.filter(item => item !== 'guardian');
                    data.user.multifactor = data.user.multifactor.length ? data.user.multifactor : null;
                  } else if (!data.user.multifactor && enrollments) {
                    data.user.multifactor = [ 'guardian' ];
                  }

                  return res.json(data);
                });
            } else {
              return res.json(data);
            }
          })
      )
      .catch((err) => {
        logger.error('Failed to get user because: ', err);
        next(err);
      });
  });

  /*
   * Deleta a user.
   */
  api.delete('/:id', verifyUserAccess('delete:user', scriptManager), (req, res, next) => {
    if (req.user.sub === req.params.id) {
      return next(new ValidationError('You cannot delete yourself.'));
    }

    return req.auth0.users.delete({ id: req.params.id })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Patch a user.
   */
  api.patch('/:id', verifyUserAccess('change:profile', scriptManager), (req, res, next) => {
    const settingsContext = {
      request: {
        user: req.user
      },
      locale: req.headers['dae-locale']
    };

    scriptManager.execute('settings', settingsContext)
      .then((settings) => {
        const defaultFields = [ 'username', 'email', 'password', 'repeatPassword', 'connection' ];
        const allowedFields = _.map(
          _.filter(settings.userFields,
            field => field.edit &&
              !_.includes(defaultFields, field.property)
          ), 'property');
        return executeWriteHook(req, scriptManager, settings.userFields, allowedFields);
      })
      .then(payload => req.auth0.users.update({ id: req.params.id }, payload))
      .then(() => res.status(204).send())
      .catch(next);
  });

  /*
   * Trigger a password reset for the user.
   */
  api.post('/:id/password-reset', verifyUserAccess('reset:password', scriptManager), (req, res, next) => {
    const client = new auth0.AuthenticationClient({
      domain: config('AUTH0_DOMAIN'),
      clientId: config('AUTH0_CLIENT_ID')
    });

    const user = req.targetUser;
    const data = { email: user.email, connection: req.body.connection };
    return client.requestChangePasswordEmail(data)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Change the password of a user.
   */
  api.put('/:id/change-password', verifyUserAccess('change:password', scriptManager), (req, res, next) => {
    if (req.body.password !== req.body.repeatPassword) {
      return next(new ArgumentError('Passwords don\'t match'));
    }

    const settingsContext = {
      request: {
        user: req.user
      },
      locale: req.headers['dae-locale']
    };

    return scriptManager.execute('settings', settingsContext)
      .then((settings) => {
        // If userFields is specified in the settings hook, then call the write hook and pass the userFields.
        if (settings && settings.userFields) {
          return executeWriteHook(req, scriptManager, settings.userFields, [ 'password', 'repeatPassword' ])
            .then((payload) => {
              if (!payload.password) {
                throw new ValidationError('The password is required.');
              }

              // Allow app_metadata in case someone needs to set a field in app_metadata to store a flag associated
              // with the change
              payload = _.pick(payload, [ 'password', 'connection', 'verify_password', 'app_metadata' ]);

              const payloadFinal = _.defaults(payload, {
                connection: req.body.connection,
                verify_password: false
              });

              return req.auth0.users.update({ id: req.params.id }, payloadFinal)
                .then(() => res.sendStatus(204))
                .catch(next);
            });
        }

        return req.auth0.users.update({ id: req.params.id }, {
          password: req.body.password,
          connection: req.body.connection,
          verify_password: false
        })
          .then(() => res.sendStatus(204))
          .catch(next);
      })
      .catch(next);
  });

  /*
   * Change the username of a user.
   */
  api.put('/:id/change-username', verifyUserAccess('change:username', scriptManager), (req, res, next) => {
    const settingsContext = {
      request: {
        user: req.user
      },
      locale: req.headers['dae-locale']
    };

    scriptManager.execute('settings', settingsContext)
      .then((settings) => {
        // If userFields is specified in the settings hook, then call the write hook and pass the userFields.
        if (settings && settings.userFields) {
          executeWriteHook(req, scriptManager, settings.userFields, [ 'username' ])
            .then((payload) => {
              if (!payload.username) {
                throw new ValidationError('The username is required.');
              }

              return req.auth0.users.update({ id: req.params.id }, payload);
            })
            .then(() => res.status(204).send())
            .catch(next);
        } else {
          req.auth0.users.update({ id: req.params.id }, { username: req.body.username })
            .then(() => res.sendStatus(204))
            .catch(next);
        }
      })
      .catch(next);
  });

  /*
   * Change the email of a user.
   */
  api.put('/:id/change-email', verifyUserAccess('change:email', scriptManager), (req, res, next) => {
    const settingsContext = {
      request: {
        user: req.user
      },
      locale: req.headers['dae-locale']
    };

    scriptManager.execute('settings', settingsContext)
      .then((settings) => {
        // If userFields is specified in the settings hook, then call the write hook and pass the userFields.
        if (settings && settings.userFields) {
          executeWriteHook(req, scriptManager, settings.userFields, [ 'email' ])
            .then((payload) => {
              if (!payload.email) {
                throw new ValidationError('The email is required.');
              }

              return req.auth0.users.update({ id: req.params.id }, payload);
            })
            .then(() => res.status(204).send())
            .catch(next);
        } else {
          req.auth0.users.update({ id: req.params.id }, { email: req.body.email })
            .then(() => res.sendStatus(204))
            .catch(next);
        }
      })
      .catch(next);
  });

  /*
   * Get all devices for the user.
   */
  api.get('/:id/devices', verifyUserAccess('read:devices', scriptManager), (req, res, next) => {
    req.auth0.deviceCredentials.getAll({ user_id: req.params.id })
      .then(devices => res.json({ devices }))
      .catch(next);
  });

  /*
   * Get all logs for a user.
   */
  api.get('/:id/logs', verifyUserAccess('read:logs', scriptManager), (req, res, next) => {
    getApiToken(req)
      .then((accessToken) => {
        const options = {
          uri: `https://${config('AUTH0_DOMAIN')}/api/v2/users/${encodeURIComponent(req.params.id)}/logs`,
          headers: {
            authorization: `Bearer ${accessToken}`
          },
          json: true
        };

        return request.get(options, (err, response, body) => {
          if (err) {
            return next(err);
          }

          if (response.statusCode < 200 || response.statusCode >= 300) {
            logger.error('Log response failed: ', response.headers);
            return next(new Error((body && (body.error || body.message || body.code)) || `Request Error: ${response.statusCode}`));
          }

          return res.json(body);
        });
      })
      .catch(next);
  });

  /*
   * Remove MFA for the user.
   */
  api.delete('/:id/multifactor/:provider', verifyUserAccess('remove:multifactor-provider', scriptManager), (req, res, next) => {
    const provider = req.params.provider;
    const userId = req.params.id;

    if (provider === 'duo' || provider === 'google-authenticator') {
      req.auth0.users.deleteMultifactorProvider({ id: userId, provider })
        .then(() => res.sendStatus(204))
        .catch(next);
    } else {
      getApiToken(req).then(accessToken => removeGuardian(accessToken, userId))
        .then(() => res.sendStatus(204))
        .catch(next);
    }
  });

  /*
   * Block a user.
   */
  api.put('/:id/block', verifyUserAccess('block:user', scriptManager), (req, res, next) => {
    req.auth0.users.update({ id: req.params.id }, { blocked: true })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Unblock a user.
   */
  api.put('/:id/unblock', verifyUserAccess('unblock:user', scriptManager), (req, res, next) => {
    req.auth0.users.update({ id: req.params.id }, { blocked: false })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Remove anomaly blocks.
   */
  api.delete('/:id/blocks', verifyUserAccess('unblock:user', scriptManager), (req, res, next) => {
    getApiToken(req)
      .then(token => removeUserBlocks(token, req.params.id))
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Send verification email to the user.
   */
  api.post('/:id/send-verification-email', verifyUserAccess('send:verification-email', scriptManager), (req, res, next) => {
    const data = {
      user_id: req.params.id
    };

    req.auth0.jobs.verifyEmail(data)
      .then(() => res.status(204).send())
      .catch(next);
  });

  return api;
};
