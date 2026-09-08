import { expect } from 'chai';
const nock = require('nock');
const jwt = require('jsonwebtoken');

const extensionTools = require('../../../../vendor/auth0-extension-tools');
const { ArgumentError, ManagementApiError } = require('../../../../vendor/auth0-extension-tools/errors');
const managementApi = require('../../../../vendor/auth0-extension-tools/auth0/managementApi');

describe('vendor/auth0-extension-tools/managementApi', () => {
  it('extension-tools should expose the managementApiHelper', () => {
    expect(extensionTools.managementApi === managementApi).to.be.ok;
  });

  describe('#getAccessToken', () => {
    it('should handle network errors correctly', (done) => {
      managementApi.getAccessToken('foo.some.domain.tld', 'myclient', 'mysecret')
        .catch(function(err) {
          expect(err).to.be.ok;
          expect(err.code).to.be.ok;
          expect(err.code).to.equal('ENOTFOUND');
          done();
        })
        .catch(done);
    });

    it('should handle unauthorized errors correctly', (done) => {
      nock('https://tenant.auth0cluster.com')
        .post('/oauth/token')
        .reply(401, 'Unauthorized');

      managementApi.getAccessToken('tenant.auth0cluster.com', 'myclient', 'mysecret')
        .catch(function(err) {
          expect(err).to.be.ok;
          expect(err.status).to.be.ok;
          expect(err.status).to.equal(401);
          expect(err.code).to.equal('unauthorized');
          expect(err).to.be.an.instanceof(ManagementApiError);
          nock.cleanAll();
          done();
        })
        .catch(done);
    });

    it('should handle unknown errors correctly', (done) => {
      nock('https://tenant.auth0cluster.com')
        .post('/oauth/token')
        .reply(200, 'foo');

      managementApi.getAccessToken('tenant.auth0cluster.com', 'myclient', 'mysecret')
        .catch(function(err) {
          expect(err).to.be.ok;
          expect(err.status).to.be.ok;
          expect(err.status).to.equal(400);
          expect(err.code).to.equal('unknown_error');
          expect(err).to.be.an.instanceof(ManagementApiError);
          nock.cleanAll();
          done();
        })
        .catch(done);
    });

    it('should handle forbidden errors correctly', (done) => {
      nock('https://tenant.auth0cluster.com')
        .post('/oauth/token')
        .reply(403, {
          error: 'access_denied',
          error_description: 'Client is not authorized to access .... You might probably want to create a .. associated to this API.'
        });

      managementApi.getAccessToken('tenant.auth0cluster.com', 'myclient', 'mysecret')
        .catch(function(err) {
          expect(err).to.be.ok;
          expect(err.status).to.be.ok;
          expect(err.status).to.equal(403);
          expect(err.code).to.equal('access_denied');
          expect(err).to.be.an.instanceof(ManagementApiError);
          nock.cleanAll();
          done();
        })
        .catch(done);
    });

    it('should return access token', (done) => {
      nock('https://tenant.auth0cluster.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: 'abc'
        });

      managementApi.getAccessToken('tenant.auth0cluster.com', 'myclient', 'mysecret')
        .then(function(accessToken) {
          expect(accessToken).to.be.ok;
          expect(accessToken).to.equal('abc');
          nock.cleanAll();
          done();
        })
        .catch(done);
    });
  });

  describe('#getAccessTokenCached', () => {
    it('should cache the access token', (done) => {
      nock('https://tenant.auth0cluster.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: 'abc'
        });
      nock('https://tenant.auth0cluster2.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: 'def'
        });

      managementApi.getAccessTokenCached('tenant.auth0cluster.com', 'myclient', 'mysecret')
        .then(function(accessToken) {
          expect(accessToken).to.be.ok;
          expect(accessToken).to.equal('abc');

          managementApi.getAccessTokenCached('tenant.auth0cluster.com', 'myclient', 'mysecret')
            .then(function(accessToken2) {
              expect(accessToken2).to.be.ok;
              expect(accessToken2).to.equal('abc');

              managementApi.getAccessTokenCached('tenant.auth0cluster2.com', 'myclient', 'mysecret')
                .then(function(accessToken3) {
                  expect(accessToken3).to.be.ok;
                  expect(accessToken3).to.equal('def');
                  nock.cleanAll();
                  done();
                })
                .catch(done);
            })
            .catch(done);
        })
        .catch(done);
    });

    it('should cache the access token based on its expiration', function(done) {
      this.timeout(10000);

      const token = jwt.sign({ foo: 'bar' }, 'shhhhh', { expiresIn: '14s' });

      nock('https://tenant.auth0cluster3.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: token
        });

      managementApi.getAccessTokenCached('tenant.auth0cluster3.com', 'myclient', 'mysecret')
        .then(function(accessToken) {
          expect(accessToken).to.be.ok;
          expect(accessToken).to.equal(token);

          setTimeout(function() {
            managementApi.getAccessTokenCached('tenant.auth0cluster3.com', 'myclient', 'mysecret')
              .then(function(accessToken2) {
                expect(accessToken2).to.be.ok;
                expect(accessToken2).to.equal(token);

                nock('https://tenant.auth0cluster3.com')
                  .post('/oauth/token')
                  .reply(200, {
                    access_token: 'def'
                  });

                setTimeout(function() {
                  managementApi.getAccessTokenCached('tenant.auth0cluster3.com', 'myclient', 'mysecret')
                    .then(function(accessToken3) {
                      expect(accessToken3).to.be.ok;
                      expect(accessToken3).to.equal('def');
                      nock.cleanAll();
                      done();
                    })
                    .catch(done);
                }, 2000);
              })
              .catch(done);
          }, 3000);
        })
        .catch(done);
    });

    it('should handle errors correctly', (done) => {
      nock('https://tenant.auth0cluster.com')
        .post('/oauth/token')
        .reply(400, {
          error: 'foo'
        });

      managementApi.getAccessTokenCached('tenant.auth0cluster.com', 'myclient', 'mysecret2')
        .catch(function(err) {
          expect(err).to.be.ok;
          expect(err.code).to.equal('foo');

          nock('https://tenant.auth0cluster.com')
            .post('/oauth/token')
            .reply(200, {
              access_token: 'abc'
            });

          managementApi.getAccessTokenCached('tenant.auth0cluster.com', 'myclient', 'mysecret2')
            .then(function(accessToken2) {
              expect(accessToken2).to.be.ok;
              expect(accessToken2).to.equal('abc');
              nock.cleanAll();
              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  describe('#getClient', () => {
    it('should validate options', (done) => {
      try {
        managementApi.getClient();
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      try {
        managementApi.getClient({ });
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      try {
        managementApi.getClient({ domain: 1 });
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      try {
        managementApi.getClient({ domain: 'foo' });
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      try {
        managementApi.getClient({ domain: 'foo', accessToken: '' });
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      try {
        managementApi.getClient({ domain: 'foo', accessToken: 123 });
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      try {
        managementApi.getClient({ domain: 'foo', clientId: 123 });
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      try {
        managementApi.getClient({ domain: 'foo', clientId: 'abc' });
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      try {
        managementApi.getClient({ domain: 'foo', clientId: 'abc', clientSecret: 456 });
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.be.an.instanceof(ArgumentError);
      }

      managementApi.getClient({ domain: 'foo', accessToken: 'def' })
        .then(function(auth0) {
          expect(auth0).to.be.ok;
          done();
        })
        .catch(done);
    });

    it('should create a client for accessToken', (done) => {
      managementApi.getClient({ domain: 'foo', accessToken: 'def' })
        .then(function(auth0) {
          expect(auth0).to.be.ok;
          done();
        })
        .catch(done);
    });

    it('should create a client for accessToken with headers', (done) => {
      managementApi.getClient({ domain: 'foo', accessToken: 'def', headers: { customHeader: 'custom' } })
        .then(function(auth0) {
          expect(auth0).to.be.ok;
          const keys = Object.keys(auth0);
          keys.forEach(key => {
            if (auth0[key].resource) {
              expect(auth0[key].resource.restClient.options.headers.customHeader).to.equal('custom');
            }
          });
          done();
        })
        .catch(done);
    });

    it('should create a client for clientId/secret', (done) => {
      nock('https://tenant.auth0cluster.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: 'abc'
        });

      managementApi.getClient({ domain: 'tenant.auth0cluster.com', clientId: 'abc', clientSecret: 'def' })
        .then(function(auth0) {
          expect(auth0).to.be.ok;
          done();
        })
        .catch(done);
    });
  });
});
