const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { exec } = require('child_process');

const TESTING_DIR = path.join(process.cwd(), 'testing');

const prepareDirectory = (dir) => {
  try {
    fs.statSync(dir);
  } catch (e) {
    fs.mkdirSync(dir);
  }
};

describe('build:server', () => {
  it('should build extension bundle', (done) => {
    prepareDirectory(TESTING_DIR);

    exec('node ./bin/a0-ext build:server ./test/mocks/extension.js ./testing --pkg ./test/mocks/good.json', (err) => {
      expect(err).to.equal(null);
      const bundleContent = fs.readFileSync(path.join(TESTING_DIR, 'auth0-dummy-extension.extension.1.0.0.js'), 'utf8');

      expect(bundleContent.startsWith('"use strict"')).to.equal(true);
      expect(bundleContent).to.contain('require("some-module")');
      expect(bundleContent).to.contain('("test string")');

      done();
    });
  });
});
