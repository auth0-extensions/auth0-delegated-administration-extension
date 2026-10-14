const { expect } = require('chai');
const Path = require('path');
const getExternals = require('../../lib/externals');

describe('externals', () => {
  it('should return proper versions', (done) => {
    getExternals(Path.join(__dirname, '../mocks'))
      .then((externals) => {
        expect(externals).to.be.an('object');
        expect(externals.compatible).to.be.an('object');
        expect(externals.incompatible).to.be.an('object');
        expect(externals.compatible.async).to.be.equal('async@2.1.2');
        expect(externals.compatible.auth0).to.be.equal('auth0@2.9.1');
        expect(externals.incompatible.boom).to.be.an('object');
        expect(externals.incompatible.else).to.be.an('object');
        done();
      });
  });
});
