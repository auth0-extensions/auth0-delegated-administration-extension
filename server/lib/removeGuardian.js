import Promise from 'bluebird';
import request from 'superagent';
import memoizer from 'lru-memoizer';

import config from './config';

const getAccessToken = () =>
  new Promise((resolve, reject) => {
    const domain = config('AUTH0_DOMAIN');
    const clientId = config('AUTH0_CLIENT_ID');
    const clientSecret = config('AUTH0_CLIENT_SECRET');

    return request
      .post('https://' + domain + '/oauth/token')
      .send({
        audience: 'https://' + domain + '/api/v2/',
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        if (!res.ok || !res.body.access_token) {
          return reject(new Error('Unknown error from Management Api or no access token was provided: ' + (res.text || res.status)));
        }

        return resolve(res.body.access_token);
      });
  });

const getAccessTokenCached = Promise.promisify(
  memoizer({
      load: function(callback) {
        getAccessToken()
          .then((accessToken) => callback(null, accessToken))
          .catch(callback);
      },
      hash: function(domain, clientId, clientSecret) {
        return domain + '-' + clientId + '-' + clientSecret;
      },
      itemMaxAge: function(domain, clientId, clientSecret, accessToken) {
        try {
          const decodedToken = jwt.decode(accessToken);
          const expiresIn = new Date(0);
          expiresIn.setUTCSeconds(decodedToken.exp);
          const now = new Date().valueOf();
          return (expiresIn.valueOf() - now) - 10000;
        } catch (e) {
          return 1000;
        }
      },
      max: 100,
      maxAge: 60 * 60000
    }
  ));

const requestClearGuardian = (token, enrollmentId) =>
  new Promise((resolve, reject) => {
    if (!enrollmentId) {
      return resolve(null);
    }

    return request
      .delete('https://' + config('AUTH0_DOMAIN') + '/api/v2/guardian/enrollments/' + enrollmentId)
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json')
      .end((err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
  });

const requestGuardianEnrollments = (token, userId) =>
  new Promise((resolve, reject) => {
    request
      .get('https://' + config('AUTH0_DOMAIN') + '/api/v2/users/' + userId + '/enrollments')
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        const result = (res && res.body && res.body[0]) ? res.body[0].id : null;
        return resolve(result);
      });
  });

export default (adminToken, userId) => {
  if (adminToken) {
    return requestGuardianEnrollments(adminToken, userId)
      .then((enrollmentId) => requestClearGuardian(adminToken, enrollmentId));
  }

  let accessToken;
  return getAccessTokenCached()
    .then((token) => {
      accessToken = token;
      return requestGuardianEnrollments(token, userId);
    })
    .then((enrollmentId) => requestClearGuardian(accessToken, enrollmentId));
};
