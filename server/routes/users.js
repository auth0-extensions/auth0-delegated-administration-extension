import auth0 from 'auth0';
import request from 'request';
import Promise from 'bluebird';
import { Router } from 'express';
import { managementApi, ArgumentError, ValidationError } from 'auth0-extension-tools';

import config from '../lib/config';
import { verifyUserAccess } from '../lib/middlewares';

export default (storage, scriptManager) => {
  const api = Router();

  /*
   * Create user.
   */
  api.post('/', (req, res, next) => {
    if (!req.body.email || req.body.email.length === 0) {
      return next(new ValidationError('The email address is required.'));
    }
    if (req.body.password !== req.body.repeatPassword) {
      return next(new ValidationError('The passwords do not match.'));
    }

    const createContext = {
      request: {
        user: req.user
      },
      payload: req.body
    };

    return scriptManager.execute('create', createContext)
      .then(result => req.auth0.users.create(result || createContext.payload))
      .then(() => res.status(201).send())
      .catch(next);
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
        search: req.query.search
      }
    };

    scriptManager.execute('filter', filterContext)
      .then(filter => {
        const options = {
          sort: 'last_login:-1',
          q: (req.query.search && filter) ? `(${req.query.search}) AND ${filter}` : req.query.search || filter,
          per_page: req.query.per_page || 100,
          page: req.query.page || 0,
          include_totals: true,
          fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked,app_metadata',
          search_engine: 'v2'
        };

        return req.auth0.users.getAll(options);
      })
      .then(data =>
        Promise.map(data.users, (user) =>
          scriptManager.execute('access', { request: { user: req.user }, payload: { user, action: 'read:user' } }))
          .then(() => data))
      .then(users => res.json(users))
      .catch(next);
  });

  /*
   * Get a single user.
   */
  api.get('/:id', verifyUserAccess('read:user', scriptManager), (req, res, next) => {
    req.auth0.users.get({ id: req.params.id })
      .then(user => {
        const membershipContext = {
          request: {
            user: req.user
          },
          payload: {
            user
          }
        };

        return scriptManager.execute('memberships', membershipContext)
          .then(result => {
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
              memberships: [ ]
            };
          });
      })
      .then(data => res.json(data))
      .catch(next);
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
   * Trigger a password reset for the user.
   */
  api.post('/:id/password-reset', verifyUserAccess('reset:password', scriptManager), (req, res, next) => {
    const client = new auth0.AuthenticationClient({
      domain: config('AUTH0_DOMAIN'),
      clientId: config('AUTH0_CLIENT_ID')
    });

    req.auth0.users.get({ id: req.params.id, fields: 'email' })
      .then(user => ({ email: user.email, connection: req.body.connection, client_id: req.body.clientId }))
      .then(data => client.requestChangePasswordEmail(data))
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Change the password of a user.
   */
  api.put('/:id/change-password', verifyUserAccess('change:password', scriptManager), (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ArgumentError('Passwords don\'t match'));
    }

    return req.auth0.users.update({ id: req.params.id }, {
      password: req.body.password,
      connection: req.body.connection,
      verify_password: false
    })
      .then(() => res.sendStatus(204))
      .catch(next);
  });


  /*
   * Change the username of a user.
   */
  api.put('/:id/change-username', verifyUserAccess('change:username', scriptManager), (req, res, next) =>
    req.auth0.users.update({ id: req.params.id }, { username: req.body.username })
      .then(() => res.sendStatus(204))
      .catch(next));

  /*
   * Change the email of a user.
   */
  api.put('/:id/change-email', verifyUserAccess('change:email', scriptManager), (req, res, next) =>
    req.auth0.users.update({ id: req.params.id }, { email: req.body.email })
      .then(() => res.sendStatus(204))
      .catch(next));

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
    managementApi.getAccessTokenCached(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
      .then(accessToken => {
        const options = {
          uri: `https://${config('AUTH0_DOMAIN')}/api/v2/users/${encodeURIComponent(req.params.id)}/logs`,
          qs: {
            include_totals: true
          },
          headers: {
            authorization: `Bearer ${accessToken}`
          },
          json: true
        };

        request.get(options, (err, response, body) => {
          if (err) {
            return next(err);
          }

          if (response.statusCode < 200 || response.statusCode >= 300) {
            return next(new Error((body && (body.error || body.message || body.code)) || `Request Error: ${response.statusCode}`));
          }

          return res.json(body);
        });

        return request.get(options);
      })
      .catch(next);
  });

  /*
   * Remove MFA for the user.
   */
  api.delete('/:id/multifactor/:provider', verifyUserAccess('remove:multifactor-provider', scriptManager), (req, res, next) => {
    req.auth0.users.deleteMultifactorProvider({ id: req.params.id, provider: req.params.provider })
      .then(() => res.sendStatus(204))
      .catch(next);
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
