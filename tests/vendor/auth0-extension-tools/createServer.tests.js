const { expect } = require('chai');
const { createServer } = require('../../../vendor/auth0-extension-tools/createServer');
const extensionTools = require('../../../vendor/auth0-extension-tools');

describe('vendor/auth0-extension-tools/createServer', () => {
  it('extension-tools should expose createServer', () => {
    expect(extensionTools.createServer).to.equal(createServer);
  });

  it('createServer should get config from the webtask context', () => {
    const server = {};
    const webtaskContext = { storage: {} };
    const serverFactory = createServer((config) => {
      expect(config).to.be.ok;
      expect(config('HOSTING_ENV')).to.equal('webtask');
      return server;
    });

    serverFactory(webtaskContext);
  });

  it('createServer should get storage from the webtask context', () => {
    const server = {};
    const webtaskStorage = {};
    const webtaskContext = { storage: webtaskStorage };
    const serverFactory = createServer((config, storage) => {
      expect(storage).to.be.ok;
      expect(storage).to.equal(webtaskStorage);
      return server;
    });

    serverFactory(webtaskContext);
  });

  it('createServer should initialize the server once', () => {
    const server = {};
    const webtaskContext = { storage: {} };
    const serverFactory = createServer(() => server);

    const server1 = serverFactory(webtaskContext);
    const server2 = serverFactory(webtaskContext);

    expect(server1).to.equal(server);
    expect(server2).to.equal(server1);
  });
});
