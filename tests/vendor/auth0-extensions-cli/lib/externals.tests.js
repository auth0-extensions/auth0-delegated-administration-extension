const { expect } = require('chai');
const Path = require('path');
const getExternals = require('../../../../vendor/auth0-extensions-cli/lib/externals');

const { findMissingExternals, CanirequireNetworkError } = getExternals;

describe('externals', () => {
  it('should return proper versions', (done) => {
    getExternals(Path.join(__dirname, '../mocks'))
      .then((externals) => {
        expect(externals).to.be.an('object');
        expect(externals.compatible).to.be.an('object');
        expect(externals.incompatible).to.be.an('object');
        expect(externals.compatible.async).to.be.equal('async@2.1.2');
        expect(externals.compatible.auth0).to.be.equal('auth0@2.9.1');
        // only present in the node22 module list, so this fails if the runtime header is dropped
        expect(externals.compatible.superagent).to.be.equal('superagent@10.3.0');
        expect(externals.incompatible['not-a-webtask-module']).to.be.an('object');
        expect(externals.incompatible.else).to.be.an('object');
        done();
      });
  });

  describe('findMissingExternals', () => {
    it('should return only the externals the runtime does not provide', async () => {
      const { nodeVersion, missing } = await findMissingExternals([
        'async@2.1.2',
        'lodash',
        'superagent@10.3.0',
        'superagent@9.9.9',
        '@scope/not-a-webtask-module@1.0.0',
        'not-a-webtask-module'
      ]);

      expect(nodeVersion).to.match(/^v22\./);
      expect(missing.map(({ spec }) => spec)).to.eql([
        'superagent@9.9.9',
        '@scope/not-a-webtask-module@1.0.0',
        'not-a-webtask-module'
      ]);
    });

    it('should list the versions the runtime has for a module with the wrong version', async () => {
      const { missing } = await findMissingExternals([ 'superagent@9.9.9', 'not-a-webtask-module@1.0.0' ]);

      expect(missing[0].available).to.include('10.3.0');
      expect(missing[1].available).to.eql([]);
    });

    it('should reject with a distinct error when canirequire cannot be reached', async () => {
      let error;
      try {
        await findMissingExternals([ 'async@2.1.2' ], 'node22', 'https://canirequire.invalid/');
      } catch (err) {
        error = err;
      }

      expect(error).to.be.an.instanceof(CanirequireNetworkError);
      expect(error.message).to.match(/^Network failure: unable to check available external module versions in canirequire \(/);
    });
  });
});
