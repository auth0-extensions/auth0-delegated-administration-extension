const { expect } = require('chai');
const { createServer } = require('../../../vendor/auth0-extension-express-tools/server');
const expressTools = require('../../../vendor/auth0-extension-express-tools');

describe('vendor/auth0-extension-express-tools/server', () => {
  it('express-tools should expose createServer', () => {
    expect(expressTools.createServer).to.equal(createServer);
  });

  it('createServer should return a webtask request handler', () => {
    const handler = createServer(() => (req, res) => res.end());
    expect(handler).to.be.a('function');
  });

  it('createServer should not build the express app until a request arrives', () => {
    let builds = 0;
    createServer(() => {
      builds++;
      return (req, res) => res.end();
    });

    expect(builds).to.equal(0);
  });
});
