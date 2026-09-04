import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import os from 'os';

const FileStorageContext = require('../../../../vendor/auth0-extension-tools/storage/fileStorageContext');
const extensionTools = require('../../../../vendor/auth0-extension-tools');

describe('vendor/auth0-extension-tools/fileStorageContext', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dae-fsctx-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('extension-tools should expose the FileStorageContext', () => {
    const Ctx = extensionTools.FileStorageContext;
    const ctx = new Ctx('./foo.json');
    expect(ctx).to.be.ok;
    expect(ctx.constructor).to.equal(FileStorageContext);
  });

  it('FileStorageContext#constructor should throw error if path is not provided', () => {
    expect(() => {
      new FileStorageContext();
    }).to.throw();
  });

  it('FileStorageContext#constructor should throw error if path is invalid', () => {
    expect(() => {
      new FileStorageContext(339);
    }).to.throw();
  });

  it('FileStorageContext#read should return defaultData if files does not exist', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    const ctx = new FileStorageContext(filePath, { mergeWrites: true, defaultData: { foo: 'bar' } });
    ctx.read()
      .then((data) => {
        expect(data).to.be.ok;
        expect(data.foo).to.be.ok;
        expect(data.foo).to.equal('bar');
        done();
      })
      .catch(done);
  });

  it('FileStorageContext#read should fallback to empty object if data is empty', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    const ctx = new FileStorageContext(filePath);
    ctx.read()
      .then((data) => {
        expect(data).to.be.ok;
        expect(JSON.stringify(data)).to.equal('{}');
        done();
      })
      .catch(done);
  });

  it('FileStorageContext#read should handle errors correctly when read permissions are denied', function(done) {
    // chmod-based permission enforcement is bypassed for root (common in CI/Docker),
    // so the read would succeed and this test could never observe the error.
    if (typeof process.getuid === 'function' && process.getuid() === 0) {
      this.skip();
      return;
    }

    const filePath = path.join(tempDir, 'data.json');
    // Write a file with content
    fs.writeFileSync(filePath, 'file content here');

    // Make file unreadable by removing read permissions
    fs.chmodSync(filePath, 0o000);

    const ctx = new FileStorageContext(filePath, { mergeWrites: true, defaultData: { foo: 'bar' } });

    ctx.read()
      .catch((err) => {
        // Restore permissions for cleanup
        fs.chmodSync(filePath, 0o644);
        expect(err).to.be.ok;
        done();
      });
  });

  it('FileStorageContext#read should read files correctly', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '{ "application": "my-app" }');

    const ctx = new FileStorageContext(filePath, { mergeWrites: true, defaultData: { foo: 'bar' } });
    ctx.read()
      .then((data) => {
        expect(data).to.be.ok;
        expect(data.application).to.be.ok;
        expect(data.application).to.equal('my-app');
        done();
      })
      .catch(done);
  });

  it('FileStorageContext#read should return defaultData if file is empty', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '');

    const ctx = new FileStorageContext(filePath, { mergeWrites: true, defaultData: { foo: 'bar' } });
    ctx.read()
      .then((data) => {
        expect(data).to.be.ok;
        expect(data.foo).to.be.ok;
        expect(data.foo).to.equal('bar');
        done();
      })
      .catch(done);
  });

  it('FileStorageContext#read should write files correctly', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '{ "application": "my-app" }');

    const ctx = new FileStorageContext(filePath);
    ctx.write({ application: 'my-new-app' })
      .then(() => {
        const file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        expect(file).to.be.ok;
        expect(file.application).to.be.ok;
        expect(file.application).to.equal('my-new-app');
        done();
      })
      .catch(done);
  });

  it('FileStorageContext#read should handle invalid json when reading the file', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '{ application": "my-app" }');

    const ctx = new FileStorageContext(filePath);
    ctx.read()
      .catch((e) => {
        expect(e).to.be.ok;
        done();
      });
  });

  it('FileStorageContext#write should merge objects if mergeWrites is true', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '{ "application": "my-app" }');

    const ctx = new FileStorageContext(filePath, { mergeWrites: true });
    ctx.write({ version: '123' })
      .then(() => {
        const file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        expect(file).to.be.ok;
        expect(file.application).to.be.ok;
        expect(file.application).to.equal('my-app');
        expect(file.version).to.be.ok;
        expect(file.version).to.equal('123');
        done();
      })
      .catch(done);
  });

  it('FileStorageContext#write should merge objects if mergeWrites is true and respect ordering', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '{ "foo": "bar", "application": "my-app" }');

    const ctx = new FileStorageContext(filePath, { mergeWrites: true });
    ctx.write({ version: '123', application: 'my-new-app' })
      .then(() => {
        const file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        expect(file).to.be.ok;
        expect(file.foo).to.be.ok;
        expect(file.foo).to.equal('bar');
        expect(file.application).to.be.ok;
        expect(file.application).to.equal('my-new-app');
        expect(file.version).to.be.ok;
        expect(file.version).to.equal('123');
        done();
      })
      .catch(done);
  });

  it('FileStorageContext#write should merge objects if mergeWrites is false', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '{ "application": "my-app" }');

    const ctx = new FileStorageContext(filePath, { mergeWrites: false });
    ctx.write({ version: '123' })
      .then(() => {
        const file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        expect(file).to.be.ok;
        expect(file.application).to.not.be.ok;
        expect(file.version).to.be.ok;
        expect(file.version).to.equal('123');
        done();
      })
      .catch(done);
  });

  it('FileStorageContext#write should handle errors correctly when writing problematic objects', (done) => {
    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '{ "application": "my-app" }');

    const a = { foo: 'bar' };
    const b = { bar: 'foo' };

    a.b = b;
    b.a = a;

    const ctx = new FileStorageContext(filePath, { mergeWrites: true });
    ctx.write({ a: a, b: b })
      .catch((err) => {
        expect(err).to.be.ok;
        expect(err.name).to.be.ok;
        expect(err.name).to.equal('TypeError');
        done();
      });
  });

  it('FileStorageContext#write should handle errors correctly when write permissions are denied', function(done) {
    // chmod-based permission enforcement is bypassed for root (common in CI/Docker),
    // so the write would succeed and this test could never observe the error.
    if (typeof process.getuid === 'function' && process.getuid() === 0) {
      this.skip();
      return;
    }

    const filePath = path.join(tempDir, 'data.json');
    fs.writeFileSync(filePath, '{ "application": "my-app" }');

    // Make file unwritable by removing write permissions
    fs.chmodSync(filePath, 0o444);

    const ctx = new FileStorageContext(filePath, { mergeWrites: true });
    ctx.write({ version: '123' })
      .then(() => {
        // Restore permissions for cleanup
        fs.chmodSync(filePath, 0o644);
        expect.fail('Should not write the file.');
      })
      .catch((err) => {
        // Restore permissions for cleanup
        fs.chmodSync(filePath, 0o644);
        expect(err).to.be.ok;
        expect(err.message).to.be.a('string');
        done();
      });
  });
});
