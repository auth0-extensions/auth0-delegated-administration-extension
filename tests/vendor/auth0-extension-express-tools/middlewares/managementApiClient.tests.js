import { expect } from 'chai';
import managementApiClientMiddleware from '../../../../vendor/auth0-extension-express-tools/middlewares/managementApiClient';

describe('vendor/auth0-extension-express-tools/managementApiClient', () => {
  it('should attach client to the request', (done) => {
    const options = {
      domain: 'me.auth0.com',
      accessToken: 'ey'
    };

    const mw = managementApiClientMiddleware(options);
    expect(mw).to.be.ok;

    const req = { };
    mw(req, { }, function() {
      expect(req).to.be.ok;
      expect(req.auth0).to.be.ok;
      expect(req.auth0.users).to.be.ok;
      expect(req.auth0.users.getAll).to.be.ok;
      done();
    });
  });

  it('should bubble up errors in the middleware', (done) => {
    const options = {
      domain: 'me.auth0.com',
      clientId: 'foo',
      clientSecret: 'bar'
    };

    const mw = managementApiClientMiddleware(options);
    expect(mw).to.be.ok;

    const req = { };
    mw(req, { }, function(err) {
      expect(err).to.be.ok;
      expect(req.auth0).to.not.be.ok;
      done();
    });
  });

  it('should attach client to the request with headers', (done) => {
    const options = {
      domain: 'me.auth0.com',
      accessToken: 'ey',
      headers: { customHeader: 'custom' }
    };

    const mw = managementApiClientMiddleware(options);
    expect(mw).to.be.ok;

    const req = { };
    mw(req, { }, function() {
      expect(req).to.be.ok;
      expect(req.auth0).to.be.ok;
      const keys = Object.keys(req.auth0);
      keys.forEach(key => {
        if (req.auth0[key].resource) {
          expect(req.auth0[key].resource.restClient.options.headers.customHeader).to.equal('custom');
        }
      });
      done();
    });
  });
});
