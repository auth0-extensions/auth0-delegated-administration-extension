const { expect } = require('chai');
const { validateHookToken, HookTokenError } = require('../../../vendor/auth0-extension-tools');
const extensionTools = require('../../../vendor/auth0-extension-tools');

describe('vendor/auth0-extension-tools/validateHookToken', () => {
  it('extension-tools should expose validateHookToken', () => {
    expect(extensionTools.validateHookToken).to.equal(validateHookToken);
  });

  it('validateHookToken should require a token', () => {
    let exceptionThrown = false;
    try {
      validateHookToken();
    } catch (e) {
      exceptionThrown = true;
      expect(e).to.be.ok;
      expect(e).to.be.an.instanceof(HookTokenError);
    }
    expect(exceptionThrown).to.be.true;
  });

  it('validateHookToken reject invalid tokens', () => {
    let exceptionThrown = false;
    try {
      validateHookToken('me.auth0.com', 'https://webtask.io/run/abc', '/extension/uninstall', 'mysecret', 'faketoken');
    } catch (e) {
      exceptionThrown = true;
      expect(e).to.be.ok;
      expect(e).to.be.an.instanceof(HookTokenError);
      expect(e.innerError).to.be.ok;
    }
    expect(exceptionThrown).to.be.true;
  });

  it('validateHookToken accept valid tokens', () => {
    const isValid = validateHookToken('me.auth0.com', 'https://webtask.io/run/abc', '/extension/uninstall', 'mysecret',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL21lLmF1dGgwLmNvbSIsImF1ZCI6Imh0dHBzOi8vd2VidGFzay5pby9ydW4vYWJjL2V4dGVuc2lvbi91bmluc3RhbGwifQ.fdAaM7cLdirmv4KyQ46Vq4eat04gRb7KWi8kpQAhA-Q');
    expect(isValid).to.be.ok;
  });
});
