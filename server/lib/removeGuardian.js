import Promise from 'bluebird';
import request from 'superagent';

import config from './config';
import logger from './logger';

export const requestAuthenticationMethods = (token, userId) =>
  new Promise((resolve, reject) => {
    const path = `/api/v2/users/${userId}/authentication-methods`;
    const url = `https://${config('AUTH0_DOMAIN')}${path}`;
    logger.info('[requestAuthenticationMethods] outgoing request ' + JSON.stringify({
      method: 'GET',
      url,
      path,
      params: { userId },
      query: {},
      body: null,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      bearerToken: token
    }));
    request
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          logger.info('[requestAuthenticationMethods] error response ' + JSON.stringify({
            status: err.status,
            message: err.message,
            response: res && res.body
          }));
          return reject(err);
        }

        logger.info('[requestAuthenticationMethods] success response ' + JSON.stringify({
          status: res.status,
          body: res.body
        }));
        const methods = (res && res.body) ? res.body : [];
        return resolve(methods);
      });
  });

export const removeAllAuthenticationMethods = (token, userId) =>
  new Promise((resolve, reject) => {
    const path = `/api/v2/users/${userId}/authentication-methods`;
    const url = `https://${config('AUTH0_DOMAIN')}${path}`;
    logger.info('[removeAllAuthenticationMethods] outgoing request ' + JSON.stringify({
      method: 'DELETE',
      url,
      path,
      params: { userId },
      query: {},
      body: null,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      bearerToken: token
    }));
    request
      .del(url)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          logger.info('[removeAllAuthenticationMethods] error response ' + JSON.stringify({
            status: err.status,
            message: err.message,
            response: res && res.body
          }));
          return reject(err);
        }

        logger.info('[removeAllAuthenticationMethods] success response ' + JSON.stringify({
          status: res && res.status
        }));
        return resolve();
      });
  });
