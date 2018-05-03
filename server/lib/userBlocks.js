import Promise from 'bluebird';
import request from 'superagent';

import config from './config';

export default (token, userId) =>
  new Promise((resolve, reject) => {
    request
      .get(`https://${config('AUTH0_DOMAIN')}/api/v2/user-blocks/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        const result = (res && res.body && res.body.blocked_for) ? res.body.blocked_for : null;
        return resolve(result);
      });
  });
