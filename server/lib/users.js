import auth0 from 'auth0';
import request from 'request';
import Promise from 'bluebird';
import { managementApi, ArgumentError } from 'auth0-extension-tools';

import config from '../lib/config';
let manager;
export default class Users {
  constructor(scriptManager) {
    if (scriptManager === null || scriptManager === undefined) {
      throw new ArgumentError('Must provide a scriptManager.');
    }

    manager = scriptManager;
  }

  /*
   * Create user.
   */
  create(req, res, next) {
    const createContext = {
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

    manager.execute('create', createContext)
      .then(result => req.auth0.users.create(result || createContext.payload))
      .then(() => res.status(201).send())
      .catch(next);
  }

  /*
   * Get all users.
   */
  getAll(req, res, next) {
    const filterContext = {
      request: {
        user: req.user
      },
      payload: {
        search: req.query.search
      }
    };

    manager.execute('filter', filterContext)
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
          manager.execute('access', { request: { user: req.user }, payload: { user } }))
          .then(() => data))
      .then(users => res.json(users))
      .catch(next);
  }

  /*
   * Get a single user.
   */
  getOne(req, res, next) {
    req.auth0.users.get({ id: req.params.id })
      .then(user => {
        const membershipContext = {
          request: { user }
        };

        return manager.execute('memberships', membershipContext)
          .then(memberships => ({ user, memberships }));
      })
      .then(data => res.json(data))
      .catch(next);
  }

  /*
   * Deleta a user.
   */
  delete(req, res, next) {
    req.auth0.users.delete({ id: req.params.id })
      .then(() => res.sendStatus(204))
      .catch(next);
  }

  /*
   * Trigger a password reset for the user.
   */
  resetPassword(req, res, next) {
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
  }

  /*
   * Change the password of a user.
   */
  changePassword(req, res, next) {
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
  }


  /*
   * Change the username of a user.
   */
  changeUsername(req, res, next) {
    req.auth0.users.update({ id: req.params.id }, { username: req.body.username })
      .then(() => res.sendStatus(204))
      .catch(next);
  }


  /*
   * Change the email of a user.
   */
  changeEmail(req, res, next) {
    req.auth0.users.update({ id: req.params.id }, { email: req.body.email })
      .then(() => res.sendStatus(204))
      .catch(next);
  }

  /*
   * Get all devices for the user.
   */
  getDevices(req, res, next) {
    req.auth0.deviceCredentials.getAll({ user_id: req.params.id })
      .then(devices => res.json({ devices }))
      .catch(next);
  }

  /*
   * Get all logs for a user.
   */
  getLogs(req, res, next) {
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
  }

  /*
   * Remove MFA for the user.
   */
  removeMFA(req, res, next) {
    req.auth0.users.deleteMultifactorProvider({ id: req.params.id, provider: req.params.provider })
      .then(() => res.sendStatus(204))
      .catch(next);
  }

  /*
   * Block a user.
   */
  block(req, res, next) {
    req.auth0.users.update({ id: req.params.id }, { blocked: true })
      .then(() => res.sendStatus(204))
      .catch(next);
  }

  /*
   * Unblock a user.
   */
  unblock(req, res, next) {
    req.auth0.users.update({ id: req.params.id }, { blocked: false })
      .then(() => res.sendStatus(204))
      .catch(next);
  }

  /*
   * Send verification email to the user.
   */
  sendVerification(req, res, next) {
    const data = {
      user_id: req.params.id
    };

    req.auth0.jobs.verifyEmail(data)
      .then(() => res.status(204).send())
      .catch(next);
  }
}
