import { expect } from 'chai';
import urlHelpers from '../../../vendor/auth0-extension-express-tools/urlHelpers';

describe('vendor/auth0-extension-express-tools/urlHelpers', () => {
  describe('#getBasePath', () => {
    it('should return the base path of the request', () => {
      const req = {
        originalUrl: 'https://sandbox.it.auth0.com/api/run/mytenant/abc',
        path: '/users',
        headers: {
          host: 'sandbox.it.auth0.com'
        }
      };

      expect(urlHelpers.getBasePath(req)).to.equal('/api/run/mytenant/abc/');
    });

    it('should not overwrite tenant name with path', () => {
      const req = {
        originalUrl: 'https://sandbox.it.auth0.com/api/run/logintest/abc',
        path: '/login',
        headers: {
          host: 'sandbox.it.auth0.com'
        }
      };

      expect(urlHelpers.getBasePath(req)).to.equal('/api/run/logintest/abc/');
    });

    it('should return slash if not running in webtask', () => {
      const req = {
        path: '/users',
        headers: {
          host: 'sandbox.it.auth0.com'
        }
      };

      expect(urlHelpers.getBasePath(req)).to.equal('/');
    });
  });

  describe('#getBaseUrl', () => {
    it('should return the base path of the request', () => {
      const req = {
        originalUrl: 'https://sandbox.it.auth0.com/api/run/mytenant/abc',
        path: '/users',
        headers: {
          host: 'sandbox.it.auth0.com'
        },
        get: function() {
          return 'sandbox.it.auth0.com';
        }
      };

      expect(urlHelpers.getBaseUrl(req)).to.equal('https://sandbox.it.auth0.com/api/run/mytenant/abc');
    });

    it('should return slash if not running in webtask', () => {
      const req = {
        path: '/users',
        headers: {
          host: 'sandbox.it.auth0.com'
        },
        get: function() {
          return 'sandbox.it.auth0.com';
        }
      };

      expect(urlHelpers.getBaseUrl(req)).to.equal('https://sandbox.it.auth0.com');
    });

    it('should use https by default', () => {
      const req = {
        originalUrl: 'http://sandbox.it.auth0.com/api/run/mytenant/abc',
        path: '/users',
        headers: {
          host: 'sandbox.it.auth0.com'
        },
        get: function() {
          return 'sandbox.it.auth0.com';
        }
      };

      expect(urlHelpers.getBaseUrl(req)).to.equal('https://sandbox.it.auth0.com/api/run/mytenant/abc');
    });

    it('should not overwrite tenant name with path', () => {
      const req = {
        originalUrl: 'https://sandbox.it.auth0.com/api/run/logintest/abc',
        path: '/login',
        headers: {
          host: 'sandbox.it.auth0.com'
        },
        get: function() {
          return 'sandbox.it.auth0.com';
        }
      };

      expect(urlHelpers.getBaseUrl(req, 'http')).to.equal('http://sandbox.it.auth0.com/api/run/logintest/abc');
    });
  });
});
