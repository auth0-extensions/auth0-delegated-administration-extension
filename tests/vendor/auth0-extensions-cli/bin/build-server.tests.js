const fs = require('fs');
const os = require('os');
const path = require('path');
const { expect } = require('chai');
const { exec } = require('child_process');

const CLI = './vendor/auth0-extensions-cli/bin/a0-ext';
const MOCKS = './tests/vendor/auth0-extensions-cli/mocks';

describe('build:server', () => {
  let outputDir;

  before(() => {
    // The CLI joins the destination onto process.cwd(), so it has to be relative to it.
    outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'a0-ext-build-'));
  });

  after(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
  });

  it('should build extension bundle', function (done) {
    this.timeout(30000);

    const destination = path.relative(process.cwd(), outputDir);

    exec(`node ${CLI} build:server ${MOCKS}/extension.js ${destination} --pkg ${MOCKS}/good.json`, (err) => {
      expect(err).to.equal(null);
      const bundleContent = fs.readFileSync(path.join(outputDir, 'auth0-dummy-extension.extension.1.0.0.js'), 'utf8');

      expect(bundleContent.startsWith('"use strict"')).to.equal(true);
      expect(bundleContent).to.contain('require("some-module")');
      expect(bundleContent).to.contain('("test string")');

      done();
    });
  });
});
