const expect = require('expect');
const Promise = require('bluebird');

import ScriptManager from '../../../server/routes/users';

describe('#users', () => {
  let scriptmanager;
  const storage = {
    read: () => Promise.resolve(storage.data),
    write: (obj) => {
      storage.data = obj;
    },
    data: {
      scripts: {
        access: 'This is access script', // for reading
        filter: 'function(ctx, callback) { callback(null, ctx.user.name); }', // for successful executing
        create: '', // for writing
        memberships: 'function (ctx, callback) { callback(new Error("MembershipsError")); }', // for error return
        settings: 'function (ctx, callback) { console.log(ctx); callback(); }' // for error catch
      }
    }
  };

  before(() => {
    scriptmanager = new ScriptManager(storage);
  });

  describe('#ScriptManager', () => {
    it('should return text of script', (done) => {
      scriptmanager.get('access').then(script => {
        expect(script).toEqual('This is access script');
        done();
      });
    });

    it('should execute script and return result', (done) => {
      const conext = {
        user: {
          name: 'PassedTest'
        }
      };

      scriptmanager.execute('filter', conext).then(result => {
        expect(result).toEqual('PassedTest');
        done();
      });
    });

    it('should execute script and return error', (done) => {
      scriptmanager.execute('memberships', {}).catch(error => {
        expect(error.message).toEqual('MembershipsError');
        done();
      });
    });

    it('should execute script and catch error', (done) => {
      scriptmanager.execute('settings', {}).catch(error => {
        expect(error.name).toEqual('ReferenceError');
        done();
      });
    });

    it('should write script to storage', (done) => {
      scriptmanager.save('create', 'And this is Create').then(() => {
        expect(storage.data.scripts.create).toEqual('And this is Create');
        done();
      });
    });

    it('should return null if there is no data', (done) => {
      storage.data = {};

      scriptmanager.get('access').then(script => {
        expect(script).toEqual(null);
        done();
      });
    });

    it('should return null if trying to execute nonexistent script', (done) => {
      storage.data = {};

      scriptmanager.execute('filter').then(result => {
        expect(result).toEqual(null);
        done();
      });
    });

    it('should throw an error if storage isn`t provided', (done) => {
      try {
        const brokenManager = new ScriptManager();
      } catch (error) {
        expect(error.message).toEqual('Must provide a storage object.');
        done();
      }
    });
  });
});
