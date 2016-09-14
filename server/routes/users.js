import auth0 from 'auth0';
import request from 'request';
import { Router } from 'express';
import { managementApi } from 'auth0-extension-tools';

import config from '../lib/config';
import { verifyUserAccess } from '../lib/middlewares';

export default (storage, scriptManager) => {
  const api = Router();

  /*
   * Create user.
   */
  api.post('/', (req, res, next) => {
    const writeContext = {
      request: {
        user: req.user
      },
      payload: {
        email: req.body.email,
        connection: req.body.connection,
        group: req.body.group,
        password: req.body.password
      }
    };

    scriptManager.execute('write', writeContext)
      .then(result => req.auth0.users.create(result || writeContext.payload))
      .then(() => res.status(200).send())
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
          fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked',
          search_engine: 'v2'
        };

        return req.auth0.users.getAll(options);
      })
      .then(users => res.json(users))
      .catch(next);
  });

  /*
   * Get a single user.
   */
  api.get('/:id', verifyUserAccess(scriptManager), (req, res, next) => {
    req.auth0.users.get({ id: req.params.id })
      .then(user => res.json({ user }))
      .catch(next);
  });

  /*
   * Deleta a user.
   */
  api.delete('/:id', verifyUserAccess(scriptManager), (req, res, next) => {
    req.auth0.users.delete({ id: req.params.id })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Trigger a password reset for the user.
   */
  api.post('/:email/password-reset', (req, res, next) => {
    const client = new auth0.AuthenticationClient({
      domain: config('AUTH0_DOMAIN'),
      clientId: config('AUTH0_CLIENT_ID')
    });
    client.requestChangePasswordEmail({
      email: req.params.email,
      connection: req.body.connection,
      client_id: req.body.clientId
    })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Change the password of a user.
   */
  api.post('/:id/password-change', verifyUserAccess(scriptManager), (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
      return next(new Error('Passwords don\'t match'));
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
   * Get all devices for the user.
   */
  api.get('/:id/devices', verifyUserAccess(scriptManager), (req, res, next) => {
    req.auth0.deviceCredentials.getAll({ user_id: req.params.id })
      .then(devices => res.json({ devices }))
      .catch(next);
  });

  /*
   * Get all logs for a user.
   */
  api.get('/:id/logs', verifyUserAccess(scriptManager), (req, res, next) => {
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
            return next(new Error(body && (body.error || body.message || body.code) || `Request Error: ${response.statusCode}`));
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
  api.delete('/:id/multifactor/:provider', verifyUserAccess(scriptManager), (req, res, next) => {
    req.auth0.users.deleteMultifactorProvider({ id: req.params.id, provider: req.params.provider })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Block a user.
   */
  api.post('/:id/block', verifyUserAccess(scriptManager), (req, res, next) => {
    req.auth0.users.update({ id: req.params.id }, { blocked: true })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Unblock a user.
   */
  api.post('/:id/unblock', verifyUserAccess(scriptManager), (req, res, next) => {
    req.auth0.users.update({ id: req.params.id }, { blocked: false })
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Send verification email to the user.
   */
  api.post('/:id/send-verification-email', verifyUserAccess(scriptManager), (req, res, next) => {
    const data = {
      user_id: req.params.id
    };

    req.auth0.jobs.verifyEmail(data)
      .then(() => res.status(200).send())
      .catch(next);
  });

  return api;
};
