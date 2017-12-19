import Promise from 'bluebird';
import request from 'superagent';

import config from './config';

export const getUserBlocks = (token, userId) =>
  new Promise((resolve, reject) => {
    if (!userId) {
      return resolve(false);
    }

    return request
      .get('https://' + config('AUTH0_DOMAIN') + '/api/v2/user-blocks/' + userId)
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        const blocks = res && res.body && res.body.blocked_for;
        return resolve(!!(blocks && blocks.length));
      });
  });

export const removeUserBlocks = (token, userId) =>
  new Promise((resolve, reject) => {
    request
      .del('https://' + config('AUTH0_DOMAIN') + '/api/v2/user-blocks/' + userId)
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json')
      .end((err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
  });
