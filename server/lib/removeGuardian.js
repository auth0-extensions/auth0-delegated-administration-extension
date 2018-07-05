import Promise from 'bluebird';
import request from 'superagent';

import config from './config';

const requestClearGuardian = (token, enrollmentId) =>
  new Promise((resolve, reject) => {
    if (!enrollmentId) {
      return resolve(null);
    }

    return request
      .del(`https://${config('AUTH0_ISSUER_DOMAIN')}/api/v2/guardian/enrollments/${enrollmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
  });

export const requestGuardianEnrollments = (token, userId) =>
  new Promise((resolve, reject) => {
    request
      .get(`https://${config('AUTH0_ISSUER_DOMAIN')}/api/v2/users/${userId}/enrollments`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        const result = (res && res.body && res.body[0]) ? res.body[0].id : null;
        return resolve(result);
      });
  });

export const removeGuardian = (accessToken, userId) => requestGuardianEnrollments(accessToken, userId)
      .then(enrollmentId => requestClearGuardian(accessToken, enrollmentId));
