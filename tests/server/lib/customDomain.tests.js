import expect from 'expect';
import Promise from 'bluebird';

import ScriptManager from '../../../server/lib/scriptmanager';
import { getCustomDomainHeaders, executeWithCustomDomain } from '../../../server/lib/customDomain';
import config from '../../../server/lib/config';

describe('#customDomain', () => {
  let scriptManager;
  let data;
  const storage = {
    read: () => Promise.resolve(data),
    write: (obj) => {
      data = obj;
    }
  };

  const defaultConfig = {
    AUTH0_DOMAIN: 'testing.local.com',
    AUTH0_CLIENT_ID: 'AUTH0_CLIENT_ID',
    AUTH0_CLIENT_SECRET: 'AUTH0_CLIENT_SECRET'
  };

  beforeEach(() => {
    config.setProvider((key) => defaultConfig[key], null);
    data = { scripts: {} };
    scriptManager = new ScriptManager(storage);
    const skipCache = name => scriptManager.get(name);
    scriptManager.getCached = skipCache;
  });

  describe('#getCustomDomainHeaders', () => {
    it('should return empty object when hook does not exist', (done) => {
      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', { email: 'test@example.com' })
        .then(headers => {
          expect(headers).toEqual({});
          done();
        })
        .catch(done);
    });

    it('should return empty object when hook returns null', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, null);
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', { email: 'test@example.com' })
        .then(headers => {
          expect(headers).toEqual({});
          done();
        })
        .catch(done);
    });

    it('should return custom domain header when hook returns customDomain', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, { customDomain: 'custom.example.com' });
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', { email: 'test@example.com' })
        .then(headers => {
          expect(headers).toEqual({ 'auth0-custom-domain': 'custom.example.com' });
          done();
        })
        .catch(done);
    });

    it('should return AUTH0_DOMAIN when hook returns useCanonicalDomain: true', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, { useCanonicalDomain: true });
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', { email: 'test@example.com' })
        .then(headers => {
          expect(headers).toEqual({ 'auth0-custom-domain': 'testing.local.com' });
          done();
        })
        .catch(done);
    });

    it('should pass correct context to hook with method and payload', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          if (ctx.method === 'verify-email' && ctx.payload.user_id === 'user123') {
            callback(null, { customDomain: 'verify.example.com' });
          } else {
            callback(null, null);
          }
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: { user_id: 'user123' }
      };

      getCustomDomainHeaders(req, scriptManager, 'verify-email', { user_id: 'user123' })
        .then(headers => {
          expect(headers).toEqual({ 'auth0-custom-domain': 'verify.example.com' });
          done();
        })
        .catch(done);
    });

    it('should pass request.user and request.originalUser in context', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          if (ctx.request.user.sub === 'admin1' && ctx.request.originalUser.user_id === 'target1') {
            callback(null, { customDomain: 'admin.example.com' });
          } else {
            callback(null, null);
          }
        }
      `;

      const req = {
        user: { sub: 'admin1' },
        targetUser: { user_id: 'target1' }
      };

      getCustomDomainHeaders(req, scriptManager, 'update', {})
        .then(headers => {
          expect(headers).toEqual({ 'auth0-custom-domain': 'admin.example.com' });
          done();
        })
        .catch(done);
    });

    it('should throw ValidationError when hook returns non-object', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, 'invalid-string-response');
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', {})
        .then(() => done(new Error('Expected error to be thrown')))
        .catch(error => {
          expect(error.name).toEqual('ValidationError');
          expect(error.message).toEqual('Custom domain hook must return an object');
          done();
        });
    });

    it('should throw ValidationError when customDomain is not a string', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, { customDomain: 12345 });
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', {})
        .then(() => done(new Error('Expected error to be thrown')))
        .catch(error => {
          expect(error.name).toEqual('ValidationError');
          expect(error.message).toEqual('customDomain must be a non-empty string');
          done();
        });
    });

    it('should throw ValidationError when customDomain is empty string', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, { customDomain: '   ' });
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', {})
        .then(() => done(new Error('Expected error to be thrown')))
        .catch(error => {
          expect(error.name).toEqual('ValidationError');
          expect(error.message).toEqual('customDomain must be a non-empty string');
          done();
        });
    });

    it('should throw ValidationError when customDomain exceeds 253 characters', (done) => {
      const longDomain = 'a'.repeat(254) + '.com';
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, { customDomain: '${longDomain}' });
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', {})
        .then(() => done(new Error('Expected error to be thrown')))
        .catch(error => {
          expect(error.name).toEqual('ValidationError');
          expect(error.message).toEqual('customDomain format is not valid');
          done();
        });
    });

    it('should throw ValidationError when customDomain has invalid format', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, { customDomain: 'invalid domain with spaces' });
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', {})
        .then(() => done(new Error('Expected error to be thrown')))
        .catch(error => {
          expect(error.name).toEqual('ValidationError');
          expect(error.message).toEqual('customDomain format is not valid');
          done();
        });
    });

    it('should accept valid domain formats', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, { customDomain: 'sub.domain.example.com' });
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', {})
        .then(headers => {
          expect(headers).toEqual({ 'auth0-custom-domain': 'sub.domain.example.com' });
          done();
        })
        .catch(done);
    });

    it('should propagate hook execution errors', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(new Error('Hook execution failed'));
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', {})
        .then(() => done(new Error('Expected error to be thrown')))
        .catch(error => {
          expect(error.message).toEqual('Hook execution failed');
          done();
        });
    });

    it('should return empty object when customDomain is falsy and useCanonicalDomain is false', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, { customDomain: null, useCanonicalDomain: false });
        }
      `;

      const req = {
        user: { sub: '1' },
        targetUser: null
      };

      getCustomDomainHeaders(req, scriptManager, 'create', {})
        .then(headers => {
          expect(headers).toEqual({});
          done();
        })
        .catch(done);
    });
  });

  describe('#executeWithCustomDomain', () => {
    it('should use req.auth0 client when no custom headers returned', (done) => {
      let usedClient = null;
      const mockAuth0Client = { name: 'defaultClient' };

      const req = {
        user: { sub: '1' },
        targetUser: null,
        auth0: mockAuth0Client
      };

      const operation = (client, payload) => {
        usedClient = client;
        return Promise.resolve({ success: true });
      };

      executeWithCustomDomain(req, scriptManager, 'create', { email: 'test@example.com' }, operation)
        .then(result => {
          expect(usedClient).toEqual(mockAuth0Client);
          expect(result).toEqual({ success: true });
          done();
        })
        .catch(done);
    });

    it('should pass payload to operation function', (done) => {
      let receivedPayload = null;
      const mockAuth0Client = { name: 'defaultClient' };
      const testPayload = { email: 'test@example.com', connection: 'Username-Password' };

      const req = {
        user: { sub: '1' },
        targetUser: null,
        auth0: mockAuth0Client
      };

      const operation = (client, payload) => {
        receivedPayload = payload;
        return Promise.resolve({ success: true });
      };

      executeWithCustomDomain(req, scriptManager, 'create', testPayload, operation)
        .then(() => {
          expect(receivedPayload).toEqual(testPayload);
          done();
        })
        .catch(done);
    });

    it('should return operation result correctly', (done) => {
      const mockAuth0Client = { name: 'defaultClient' };
      const expectedResult = { user_id: 'auth0|123', email: 'test@example.com' };

      const req = {
        user: { sub: '1' },
        targetUser: null,
        auth0: mockAuth0Client
      };

      const operation = () => Promise.resolve(expectedResult);

      executeWithCustomDomain(req, scriptManager, 'create', {}, operation)
        .then(result => {
          expect(result).toEqual(expectedResult);
          done();
        })
        .catch(done);
    });

    it('should propagate operation errors', (done) => {
      const mockAuth0Client = { name: 'defaultClient' };

      const req = {
        user: { sub: '1' },
        targetUser: null,
        auth0: mockAuth0Client
      };

      const operation = () => Promise.reject(new Error('Operation failed'));

      executeWithCustomDomain(req, scriptManager, 'create', {}, operation)
        .then(() => done(new Error('Expected error to be thrown')))
        .catch(error => {
          expect(error.message).toEqual('Operation failed');
          done();
        });
    });

    it('should propagate hook validation errors', (done) => {
      data.scripts.customDomain = `
        function customDomainHook(ctx, callback) {
          callback(null, 'invalid-response');
        }
      `;

      const mockAuth0Client = { name: 'defaultClient' };

      const req = {
        user: { sub: '1' },
        targetUser: null,
        auth0: mockAuth0Client
      };

      const operation = () => Promise.resolve({ success: true });

      executeWithCustomDomain(req, scriptManager, 'create', {}, operation)
        .then(() => done(new Error('Expected error to be thrown')))
        .catch(error => {
          expect(error.name).toEqual('ValidationError');
          done();
        });
    });
  });
});
