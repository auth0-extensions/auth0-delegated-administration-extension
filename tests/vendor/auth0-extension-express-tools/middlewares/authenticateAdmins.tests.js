import { expect } from 'chai';

import { authenticateAdmins } from '../../../../vendor/auth0-extension-express-tools/middlewares';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlzcyI6Imh0dHA6Ly9hcGkiLCJhdWQiOiJ1cm46YXBpIn0.fCWP0OpIHewitj-jMEcGuKUsU8a3lmktBUCLkCE6mCc';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlzcyI6Imh0dHA6Ly9hcGkifQ.9muVyU5BI4e1qXlCZidHaUiYWUNNVbgxRD4ZEvP3kUQ';

describe('vendor/auth0-extension-express-tools/authenticateAdmins', () => {
  it('should throw error if options is null', function() {
    expect(() => {
      authenticateAdmins();
    }).to.throw();
  });

  it('should throw error if options.secret is null', function() {
    expect(() => {
      authenticateAdmins({
      });
    }).to.throw();
  });

  it('should throw error if options.secret is empty', function() {
    expect(() => {
      authenticateAdmins({
        secret: ''
      });
    }).to.throw();
  });

  it('should throw error if options.audience is null', function() {
    expect(() => {
      authenticateAdmins({
        secret: 'abc'
      });
    }).to.throw();
  });

  it('should throw error if options.audience is empty', function() {
    expect(() => {
      authenticateAdmins({
        secret: 'abc',
        audience: ''
      });
    }).to.throw();
  });

  it('should throw error if options.baseUrl is null', function() {
    expect(() => {
      authenticateAdmins({
        secret: 'abc',
        audience: 'urn:api'
      });
    }).to.throw();
  });

  it('should throw error if options.baseUrl is empty', function() {
    expect(() => {
      authenticateAdmins({
        secret: 'abc',
        audience: 'urn:api',
        baseUrl: ''
      });
    }).to.throw();
  });

  it('should return error if token is invalid', function(done) {
    const mw = authenticateAdmins({
      secret: 'abc',
      audience: 'urn:api',
      baseUrl: 'http://api'
    });
    mw({ headers: { authorization: 'Bearer xyz' } }, {}, (err) => {
      expect(err).to.be.ok;
      expect(err.name).to.equal('UnauthorizedError');
      done();
    });
  });

  it('should return error if credentials are required', function(done) {
    const mw = authenticateAdmins({
      secret: 'abc',
      audience: 'urn:api',
      baseUrl: 'http://api',
      credentialsRequired: true
    });
    mw({ headers: {} }, {}, (err) => {
      expect(err).to.be.ok;
      expect(err.name).to.equal('UnauthorizedError');
      done();
    });
  });

  it('should return the user if token is valid', function(done) {
    const mw = authenticateAdmins({
      secret: 'abc',
      audience: 'urn:api',
      baseUrl: 'http://api'
    });

    const req = { headers: { authorization: 'Bearer ' + validToken } };
    mw(req, {}, (err) => {
      expect(err).to.not.be.ok;
      expect(req.user).to.be.ok;
      expect(req.user.sub).to.equal('1234567890');
      done();
    });
  });

  it('should support the onLoginSuccess hook', function(done) {
    const mw = authenticateAdmins({
      onLoginSuccess: (req, res, next) => { req.user.role = 'Admin'; next(); },
      secret: 'abc',
      audience: 'urn:api',
      baseUrl: 'http://api'
    });

    const req = { headers: { authorization: 'Bearer ' + validToken } };
    mw(req, {}, (err) => {
      expect(err).to.not.be.ok;
      expect(req.user).to.be.ok;
      expect(req.user.sub).to.equal('1234567890');
      expect(req.user.role).to.equal('Admin');
      done();
    });
  });

  it('optional should not run if token is missing', function(done) {
    const mw = authenticateAdmins.optional({
      secret: 'abc',
      audience: 'urn:api',
      baseUrl: 'http://api'
    });

    mw({ headers: {} }, {}, (err) => {
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('optional should return error if token matches issuer but audience is invalid', function(done) {
    const mw = authenticateAdmins.optional({
      secret: 'abc',
      audience: 'urn:api',
      baseUrl: 'http://api'
    });

    mw({ headers: { authorization: 'Bearer ' + invalidToken } }, {}, (err) => {
      expect(err).to.be.ok;
      expect(err.name).to.equal('UnauthorizedError');
      done();
    });
  });

  it('optional should not run if token is invalid', function(done) {
    const mw = authenticateAdmins.optional({
      secret: 'abc',
      audience: 'urn:api',
      baseUrl: 'http://api'
    });

    mw({ headers: { authorization: 'Bearer foo' } }, {}, (err) => {
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('optional should return the user if token is valid', function(done) {
    const mw = authenticateAdmins.optional({
      onLoginSuccess: (req, res, next) => { next(); },
      secret: 'abc',
      audience: 'urn:api',
      baseUrl: 'http://api'
    });

    const req = { headers: { authorization: 'Bearer ' + validToken } };
    mw(req, {}, (err) => {
      expect(err).to.not.be.ok;
      expect(req.user).to.be.ok;
      expect(req.user.sub).to.equal('1234567890');
      done();
    });
  });
});
