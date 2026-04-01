import Promise from 'bluebird';
import request from 'superagent';

import config from './config';
import logger from './logger';

export const requestAuthenticationMethods = (token, userId) =>
  new Promise((resolve, reject) => {
    const path = `/api/v2/users/${userId}/authentication-methods`;
    const url = `https://${config('AUTH0_DOMAIN')}${path}`;
    request
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          logger.info(
            `[requestAuthenticationMethods] error response ` +
              JSON.stringify({
                status: err.status,
                message: err.message,
                response: res && res.body,
              }),
          );
          return reject(err);
        }
        const methods = (res && res.body) ? res.body : [];
        return resolve(methods);
      });
  });

export const removeAllAuthenticationMethods = (token, userId) =>
  new Promise((resolve, reject) => {
    const path = `/api/v2/users/${userId}/authentication-methods`;
    const url = `https://${config('AUTH0_DOMAIN')}${path}`;
    request
      .del(url)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          logger.info(
            "[removeAllAuthenticationMethods] error response " +
              JSON.stringify({
                status: err.status,
                message: err.message,
                response: res && res.body,
              }),
          );
          return reject(err);
        }
        return resolve();
      });
  });

const removeAuthenticationMethodById = (token, userId, methodId) =>
  new Promise((resolve, reject) => {
    const path = `/api/v2/users/${userId}/authentication-methods/${methodId}`;
    const url = `https://${config('AUTH0_DOMAIN')}${path}`;
    request
      .del(url)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          logger.info(
            "[removeAuthenticationMethodById] error response " +
              JSON.stringify({
                status: err.status,
                message: err.message,
                response: res && res.body,
              }),
          );
          return reject(err);
        }
        return resolve();
      });
  });

export const removeAuthenticationMethodsByType = (token, userId, type) =>
  requestAuthenticationMethods(token, userId)
    .then((methods) => {
      const matching = methods.filter(m => m.type === type);
      return Promise.all(matching.map(m => removeAuthenticationMethodById(token, userId, m.id)));
    });
