const { exec } = require('child_process');
const { expect } = require('chai');

describe('validator', () => {
  it('should validate good json', (done) => {
    exec('node ./vendor/auth0-extensions-cli/bin/a0-ext validate ./tests/vendor/auth0-extensions-cli/mocks/good.json', (err, stdout) => {
      expect(err).to.equal(null);
      expect(stdout).to.contain('/good.json is valid.');
      done();
    });
  });

  it('should validate and fail on bad json', (done) => {
    exec('node ./vendor/auth0-extensions-cli/bin/a0-ext validate ./tests/vendor/auth0-extensions-cli/mocks/bad.json', (err, stdout) => {
      expect(err).to.not.equal(null);
      expect(stdout).to.contain("should have required property 'name'");
      expect(stdout).to.contain("should have required property 'keywords'");
      expect(stdout).to.contain('should be equal to one of the allowed values');
      done();
    });
  });
});
