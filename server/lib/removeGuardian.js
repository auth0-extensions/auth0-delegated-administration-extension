import Promise from 'bluebird';
import request from 'superagent';

import config from './config';

export const requestAuthenticationMethods = (token, userId) =>
  new Promise((resolve, reject) => {
    request
      .get(`https://${config('AUTH0_DOMAIN')}/api/v2/users/${userId}/authentication-methods`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        const methods = (res && res.body) ? res.body : [];
        return resolve(methods);
      });
  });

export const removeAllAuthenticationMethods = (token, userId) =>
  new Promise((resolve, reject) => {
    request
      .del(`https://${config('AUTH0_DOMAIN')}/api/v2/users/${userId}/authentication-methods`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
  });
