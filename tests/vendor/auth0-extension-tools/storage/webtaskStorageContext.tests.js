import { expect } from 'chai';

const webtaskStorage = require('../mocks/webtaskStorage');
const extensionTools = require('../../../../vendor/auth0-extension-tools');
const WebtaskStorageContext = require('../../../../vendor/auth0-extension-tools/storage/webtaskStorageContext');

describe('vendor/auth0-extension-tools/webtaskStorageContext', () => {
  it('extension-tools should expose the WebtaskStorageContext', (done) => {
    const storage = webtaskStorage(null);
    const Ctx = extensionTools.WebtaskStorageContext;
    const ctx = new Ctx(storage);
    expect(ctx).to.be.ok;
    expect(ctx.constructor).to.equal(WebtaskStorageContext);
    done();
  });

  it('WebtaskStorageContext#constructor should throw error if storage object is not provided', () => {
    expect(() => {
      new WebtaskStorageContext();
    }).to.throw();
  });

  it('WebtaskStorageContext#constructor should return defaultData if data from webtask is null', (done) => {
    const storage = webtaskStorage(null);

    const ctx = new WebtaskStorageContext(storage, { defaultData: { foo: 'bar' } });
    ctx.read()
      .then((data) => {
        expect(data).to.be.ok;
        expect(data.foo).to.be.ok;
        expect(data.foo).to.equal('bar');
        done();
      })
      .catch(done);
  });

  it('WebtaskStorageContext#read should read storage correctly', (done) => {
    const storage = webtaskStorage({ foo: 'other-bar' });

    const ctx = new WebtaskStorageContext(storage, { defaultData: { foo: 'bar' } });
    ctx.read()
      .then((data) => {
        expect(data).to.be.ok;
        expect(data.foo).to.be.ok;
        expect(data.foo).to.equal('other-bar');
        done();
      })
      .catch(done);
  });

  it('WebtaskStorageContext#read should handle errors correctly when reading fails', (done) => {
    const storage = webtaskStorage(new Error('foo'));

    const ctx = new WebtaskStorageContext(storage);
    ctx.read()
      .catch((err) => {
        expect(err).to.be.ok;
        expect(err.name).to.be.ok;
        expect(err.name).to.equal('Error');
        done();
      });
  });

  it('WebtaskStorageContext#write should write files correctly', (done) => {
    let data = null;
    const storage = webtaskStorage({ application: 'my-app' }, function(updatedData) {
      data = updatedData;
    });

    const ctx = new WebtaskStorageContext(storage);
    ctx.write({ application: 'my-new-app' })
      .then(() => {
        expect(data).to.be.ok;
        expect(data.application).to.be.ok;
        expect(data.application).to.equal('my-new-app');
        done();
      })
      .catch(done);
  });

  it('WebtaskStorageContext#write should handle errors correctly when writing problematic objects', (done) => {
    const storage = webtaskStorage({ });

    const a = { foo: 'bar' };
    const b = { bar: 'foo' };

    a.b = b;
    b.a = a;

    const ctx = new WebtaskStorageContext(storage);
    ctx.write({ a: a, b: b })
      .catch((err) => {
        expect(err).to.be.ok;
        expect(err.name).to.be.ok;
        expect(err.name).to.equal('TypeError');
        done();
      });
  });

  it('WebtaskStorageContext#write should handle errors correctly when writing fails', (done) => {
    const storage = webtaskStorage(new Error('foo'));

    const ctx = new WebtaskStorageContext(storage);
    ctx.write({ foo: 'bar' })
      .catch((err) => {
        expect(err).to.be.ok;
        expect(err.name).to.be.ok;
        expect(err.name).to.equal('Error');
        done();
      });
  });
});
