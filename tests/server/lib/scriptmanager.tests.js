import expect from 'expect';
import Promise from 'bluebird';

import ScriptManager from '../../../server/lib/scriptmanager';

describe('#scripts', () => {
  let scriptmanager;
  let data;
  const storage = {
    read: () => Promise.resolve(data),
    write: (obj) => {
      data = obj;
    }
  };

  beforeEach(() => {
    data = {
      scripts: {
        access: 'This is access script', // for reading
        filter: 'function(ctx, callback) { callback(null, ctx.user.name); }', // for successful executing
        create: '', // for writing
        memberships: 'function (ctx, callback) { callback(new Error("MembershipsError")); }', // for error return
        settings: 'function (ctx, callback) { console.log(ctx); callback(); }' // for error catch
      }
    };
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
        expect(error.name).toEqual('ValidationError');
        done();
      });
    });

    it('should write script to storage', (done) => {
      scriptmanager.save('create', 'And this is Create').then(() => {
        expect(data.scripts.create).toEqual('And this is Create');
        done();
      });
    });

    it('should return null if there is no data', (done) => {
      data = {};

      scriptmanager.get('access').then(script => {
        expect(script).toEqual(null);
        done();
      });
    });

    it('should return null if trying to get nonexistent script', (done) => {
      data = {};

      scriptmanager.get('filter').then(result => {
        expect(result).toEqual(null);
        done();
      });
    });

    it('should return null if trying to get nonexistent script', (done) => {
      const emptyManager = new ScriptManager(storage);

      emptyManager.execute('fameiomzjazm').then(result => {
        expect(result).toEqual(null);
        done();
      });
    });

    it('should support reading custom data', (done) => {
      data.scripts.customRead = `function readHook(ctx, cb) {
          ctx.read()
            .then((customData) => {
              cb(null, customData);
            });
        }
        `;
      data.customData = {
        myCustomCounter: 22
      };

      const emptyManager = new ScriptManager(storage);
      emptyManager.execute('customRead').then(customData => {
        expect(customData.myCustomCounter).toEqual(22);
        done();
      });
    });

    it('should support writing custom data', (done) => {
      data.scripts.customWrite = `
        function writeHook(ctx, cb) {
          ctx.read()
            .then(() => ctx.write({ myCustomCounter: 50 }))
            .then(() => {
              cb(null, { });
            });
        }
        `;
      data.customData = {
        myCustomCounter: 50
      };

      const emptyManager = new ScriptManager(storage);
      emptyManager.execute('customWrite').then(() => {
        expect(data.customData.myCustomCounter).toEqual(50);
        done();
      });
    });

    it('should have a cache', (done) => {
      data.scripts.cacheCounter = `function writeHook(ctx, cb) {
          ctx.read()
            .then(() => {
              ctx.global.counter = (ctx.global.counter || 0) + 1;
              cb(null, ctx.global);
            });
        }`;

      const emptyManager = new ScriptManager(storage);
      emptyManager.execute('cacheCounter').then(() => {
        emptyManager.execute('cacheCounter').then(() => {
          emptyManager.execute('cacheCounter').then((res) => {
            expect(res.counter).toEqual(3);
            done();
          });
        });
      });
    });

    it('should throw an error if storage isnt provided', (done) => {
      expect(() => {
        const manager = new ScriptManager();
        expect(manager).toEqual(null);
      }).toThrow(/Must provide a storage object/);
      done();
    });
  });
});
