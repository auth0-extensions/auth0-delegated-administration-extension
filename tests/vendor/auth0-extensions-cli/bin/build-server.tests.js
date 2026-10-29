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
      expect(bundleContent).to.contain('require("lodash")');
      expect(bundleContent).to.contain('("test string")');

      done();
    });
  });

  describe('externals check', () => {
    const buildWithExternals = (externals, extension = {}, callback) => {
      const pkg = JSON.parse(fs.readFileSync(path.join(MOCKS, 'good.json'), 'utf8'));
      pkg['auth0-extension'] = Object.assign({}, pkg['auth0-extension'], extension, { externals });

      const pkgPath = path.join(outputDir, 'package.json');
      fs.writeFileSync(pkgPath, JSON.stringify(pkg));

      const destination = path.relative(process.cwd(), outputDir);
      exec(`node ${CLI} build:server ${MOCKS}/extension.js ${destination} --pkg ${path.relative(process.cwd(), pkgPath)}`, callback);
    };

    it('should fail and list every external that the runtime does not provide', function (done) {
      this.timeout(30000);

      buildWithExternals([ 'lodash', 'superagent@9.9.9', 'not-a-webtask-module@1.0.0' ], {}, (err, stdout, stderr) => {
        expect(err.code).to.equal(1);
        expect(stderr).to.contain('2 not available in the webtask runtime');
        expect(stderr).to.contain('superagent@9.9.9 (runtime has:');
        expect(stderr).to.contain('not-a-webtask-module@1.0.0 (runtime has: module not provided)');
        expect(stderr).to.not.contain('lodash (');
        done();
      });
    });

    it('should not check externals when bundleModules is false', function (done) {
      this.timeout(30000);

      buildWithExternals([ 'not-a-webtask-module@1.0.0' ], { bundleModules: false }, (err, stdout, stderr) => {
        expect(stderr).to.not.contain('not available in the webtask runtime');
        done();
      });
    });
  });

  describe('bundle size limit', () => {
    const buildWithPadding = (bytes, callback) => {
      const entry = path.join(outputDir, 'large-extension.js');
      fs.writeFileSync(entry, `module.exports = '${'a'.repeat(bytes)}';`);

      const destination = path.relative(process.cwd(), path.join(outputDir, 'out'));
      exec(`node ${CLI} build:server ${path.relative(process.cwd(), entry)} ${destination} --pkg ${MOCKS}/good.json`, callback);
    };

    it('should fail the build when the bundle is larger than 1 MiB', function (done) {
      this.timeout(30000);

      buildWithPadding(1.5 * 1024 * 1024, (err, stdout, stderr) => {
        expect(err.code).to.equal(1);
        expect(stderr).to.contain('the backend bundle is 1.50 MiB');
        expect(stderr).to.contain('exceeds the webtask limit of 1 MiB');
        done();
      });
    });

    it('should pass when the bundle is under 1 MiB', function (done) {
      this.timeout(30000);

      buildWithPadding(512 * 1024, (err, stdout, stderr) => {
        expect(err).to.equal(null);
        expect(stderr).to.not.contain('exceeds the webtask limit');
        done();
      });
    });
  });
});
