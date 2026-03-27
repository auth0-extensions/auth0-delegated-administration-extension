import nock from 'nock';
import { expect } from 'chai';
import { describe, it, afterEach } from 'mocha';

import config from '../../../server/lib/config';
import {
  requestAuthenticationMethods,
  removeAllAuthenticationMethods,
  removeAuthenticationMethodsByType
} from '../../../server/lib/removeGuardian';
import { defaultConfig } from '../../utils/dummyData';

describe('#removeGuardian', () => {
  config.setProvider((key) => defaultConfig[key], null);

  const domain = `https://${defaultConfig.AUTH0_DOMAIN}`;
  const userId = 'testuser123';
  const token = 'test-token';

  afterEach(() => nock.cleanAll());

  describe('#requestAuthenticationMethods', () => {
    it('should return authentication methods for a user', (done) => {
      const methods = [
        { id: 'method1', type: 'email' },
        { id: 'method2', type: 'phone' }
      ];
      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(200, methods);

      requestAuthenticationMethods(token, userId)
        .then((result) => {
          expect(result).to.deep.equal(methods);
          done();
        })
        .catch(done);
    });

    it('should return empty array when body is empty', (done) => {
      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(200, []);

      requestAuthenticationMethods(token, userId)
        .then((result) => {
          expect(result).to.deep.equal([]);
          done();
        })
        .catch(done);
    });

    it('should reject on error response', (done) => {
      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(403, { statusCode: 403, error: 'Forbidden', message: 'Insufficient scope' });

      requestAuthenticationMethods(token, userId)
        .then(() => done(new Error('should have rejected')))
        .catch((err) => {
          expect(err.status).to.equal(403);
          done();
        });
    });
  });

  describe('#removeAllAuthenticationMethods', () => {
    it('should DELETE all authentication methods for a user', (done) => {
      nock(domain)
        .delete(`/api/v2/users/${userId}/authentication-methods`)
        .reply(204);

      removeAllAuthenticationMethods(token, userId)
        .then(() => done())
        .catch(done);
    });

    it('should reject on error response', (done) => {
      nock(domain)
        .delete(`/api/v2/users/${userId}/authentication-methods`)
        .reply(404, { statusCode: 404, error: 'Not Found' });

      removeAllAuthenticationMethods(token, userId)
        .then(() => done(new Error('should have rejected')))
        .catch((err) => {
          expect(err.status).to.equal(404);
          done();
        });
    });
  });

  describe('#removeAuthenticationMethodsByType', () => {
    it('should remove only the methods matching the given type', (done) => {
      const methods = [
        { id: 'method1', type: 'email' },
        { id: 'method2', type: 'phone' },
        { id: 'method3', type: 'email' }
      ];

      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(200, methods);
      nock(domain)
        .delete(`/api/v2/users/${userId}/authentication-methods/method1`)
        .reply(204);
      nock(domain)
        .delete(`/api/v2/users/${userId}/authentication-methods/method3`)
        .reply(204);

      removeAuthenticationMethodsByType(token, userId, 'email')
        .then(() => done())
        .catch(done);
    });

    it('should remove a single method when only one matches', (done) => {
      const methods = [
        { id: 'method1', type: 'email' },
        { id: 'method2', type: 'phone' }
      ];

      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(200, methods);
      nock(domain)
        .delete(`/api/v2/users/${userId}/authentication-methods/method2`)
        .reply(204);

      removeAuthenticationMethodsByType(token, userId, 'phone')
        .then(() => done())
        .catch(done);
    });

    it('should resolve without any deletes if no methods match the type', (done) => {
      const methods = [{ id: 'method1', type: 'email' }];

      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(200, methods);

      removeAuthenticationMethodsByType(token, userId, 'totp')
        .then(() => done())
        .catch(done);
    });

    it('should resolve without any deletes if the user has no methods', (done) => {
      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(200, []);

      removeAuthenticationMethodsByType(token, userId, 'email')
        .then(() => done())
        .catch(done);
    });

    it('should reject if fetching authentication methods fails', (done) => {
      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(403, { statusCode: 403, error: 'Forbidden' });

      removeAuthenticationMethodsByType(token, userId, 'email')
        .then(() => done(new Error('should have rejected')))
        .catch((err) => {
          expect(err.status).to.equal(403);
          done();
        });
    });

    it('should reject if deleting an individual method fails', (done) => {
      const methods = [{ id: 'method1', type: 'email' }];

      nock(domain)
        .get(`/api/v2/users/${userId}/authentication-methods`)
        .reply(200, methods);
      nock(domain)
        .delete(`/api/v2/users/${userId}/authentication-methods/method1`)
        .reply(500, { statusCode: 500, error: 'Internal Server Error' });

      removeAuthenticationMethodsByType(token, userId, 'email')
        .then(() => done(new Error('should have rejected')))
        .catch((err) => {
          expect(err.status).to.equal(500);
          done();
        });
    });
  });
});
