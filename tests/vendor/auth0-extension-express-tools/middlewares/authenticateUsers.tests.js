import { expect } from 'chai';

const certs = require('../mocks/certs.json');
const tokens = require('../mocks/tokens');
import { authenticateUsers } from '../../../../vendor/auth0-extension-express-tools/middlewares';

describe('vendor/auth0-extension-express-tools/authenticateUsers', () => {
  it('should throw error if options is null', function() {
    expect(() => {
      authenticateUsers();
    }).to.throw();
  });

  it('should throw error if domain is null', function() {
    expect(() => {
      authenticateUsers({});
    }).to.throw();
  });

  it('should throw error if domain is empty', function() {
    expect(() => {
      authenticateUsers({ domain: '' });
    }).to.throw();
  });

  it('should throw error if audience is null', function() {
    expect(() => {
      authenticateUsers({ domain: 'me.auth0.com' });
    }).to.throw();
  });

  it('should throw error if audience is empty', function() {
    expect(() => {
      authenticateUsers({ domain: 'me.auth0.com', audience: '' });
    }).to.throw();
  });

  it('should return error if token is invalid', function(done) {
    const mw = authenticateUsers({
      domain: 'me.auth0.com',
      audience: 'urn:myapp'
    });
    mw({ headers: { authorization: 'Bearer xyz' } }, {}, (err) => {
      expect(err).to.be.ok;
      expect(err.name).to.equal('UnauthorizedError');
      done();
    });
  });

  it('should return error if credentials are required', function(done) {
    const mw = authenticateUsers({
      domain: 'me.auth0.com',
      audience: 'urn:myapp',
      credentialsRequired: true
    });
    mw({}, {}, (err) => {
      expect(err).to.be.ok;
      expect(err.name).to.equal('UnauthorizedError');
      done();
    });
  });

  it('should return the user if token is valid', function(done) {
    const mw = authenticateUsers({
      domain: 'me.auth0.com',
      audience: 'urn:myapp'
    });

    tokens.wellKnownEndpoint('me.auth0.com', certs.bar.cert, 'key2');
    const token = tokens.sign(certs.bar.private, 'key2', {
      iss: 'https://me.auth0.com/',
      sub: 'bar',
      aud: 'urn:myapp'
    });

    const req = { headers: { authorization: 'Bearer ' + token } };
    mw(req, {}, (err) => {
      expect(err).to.not.be.ok;
      expect(req.user).to.be.ok;
      expect(req.user.sub).to.equal('bar');
      done();
    });
  });

  it('should support the onLoginSuccess hook', function(done) {
    const mw = authenticateUsers({
      domain: 'me.auth0.com',
      audience: 'urn:myapp',
      onLoginSuccess: (req, res, next) => { req.user.role = 'Admin'; next(); }
    });

    tokens.wellKnownEndpoint('me.auth0.com', certs.bar.cert, 'key2');
    const token = tokens.sign(certs.bar.private, 'key2', {
      iss: 'https://me.auth0.com/',
      sub: 'bar',
      aud: 'urn:myapp'
    });

    const req = { headers: { authorization: 'Bearer ' + token } };
    mw(req, {}, (err) => {
      expect(err).to.not.be.ok;
      expect(req.user).to.be.ok;
      expect(req.user.sub).to.equal('bar');
      expect(req.user.role).to.equal('Admin');
      done();
    });
  });

  it('optional should not run if token is missing', function(done) {
    const mw = authenticateUsers.optional({
      domain: 'me.auth0.com',
      audience: 'urn:myapp'
    });

    mw({ headers: {} }, {}, (err) => {
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('optional should return error if token matches issuer but audience is invalid', function(done) {
    const mw = authenticateUsers.optional({
      domain: 'me.auth0.com',
      audience: 'urn:myapp'
    });

    tokens.wellKnownEndpoint('me.auth0.com', certs.bar.cert, 'key2');
    const token = tokens.sign(certs.bar.private, 'key2', {
      iss: 'https://me.auth0.com/',
      sub: 'bar',
      aud: 'urn:my-other-app'
    });

    mw({ headers: { authorization: 'Bearer ' + token } }, {}, (err) => {
      expect(err).to.be.ok;
      expect(err.name).to.equal('UnauthorizedError');
      done();
    });
  });

  it('optional should not run if token is invalid', function(done) {
    const mw = authenticateUsers.optional({
      domain: 'me.auth0.com',
      audience: 'urn:myapp'
    });

    mw({ headers: { authorization: 'Bearer foo' } }, {}, (err) => {
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('optional should return the user if token is valid', function(done) {
    const mw = authenticateUsers.optional({
      domain: 'me.auth0.com',
      audience: 'urn:myapp'
    });

    tokens.wellKnownEndpoint('me.auth0.com', certs.bar.cert, 'key2');
    const token = tokens.sign(certs.bar.private, 'key2', {
      iss: 'https://me.auth0.com/',
      sub: 'bar',
      aud: 'urn:myapp'
    });

    const req = { headers: { authorization: 'Bearer ' + token } };
    mw(req, {}, (err) => {
      expect(err).to.not.be.ok;
      expect(req.user).to.be.ok;
      expect(req.user.sub).to.equal('bar');
      done();
    });
  });
});
