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
        filter: 'function(ctx, callback) { ctx.log("carlos here"); callback(null, ctx.user.name); }', // for
        // successful
        // executing
        create: '', // for writing
        memberships: 'function (ctx, callback) { callback(new Error("MembershipsError")); }', // for error return
        settings: 'function (ctx, callback) { console.log(ctx.user.name); callback(); }' // for error catch
      },
      endpoints: [
        {
          name: 'get-something',
          handler: 'something'
        },
        {
          name: 'get-query',
          handler: 'function (req, callback) { callback(null, req.query); }'
        },
        {
          name: 'get-error',
          handler: 'function (req, callback) { callback(new Error("error")); }'
        },
        {
          name: 'broken',
          handler: 'not gonna work'
        }
      ]
    };
    scriptmanager = new ScriptManager(storage);
    const skipCache = (type, name) => scriptmanager.get(type, name);
    scriptmanager.getCached = skipCache;
  });

  describe('#ScriptManager', () => {
    it('should return text of script', (done) => {
      scriptmanager.get('scripts', 'access').then(script => {
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
      }).catch(e => {
        done(e)
      });
    });

    it('should execute script and return error', (done) => {
      scriptmanager.execute('memberships', {}).then(() => done('bad then')).catch(error => {
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

      scriptmanager.get('scripts', 'access').then(script => {
        expect(script).toEqual(null);
        done();
      });
    });

    it('should return null if trying to get nonexistent script', (done) => {
      data = {};

      scriptmanager.get('scripts', 'filter').then(result => {
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

    it('should return list of endpoints', (done) => {
      scriptmanager.getAllEndpoints()
        .then((endpoints) => {
          expect(endpoints.length).toEqual(4);
          expect(endpoints[0].name).toEqual('get-something');
          expect(endpoints[1].name).toEqual('get-query');
          expect(endpoints[2].name).toEqual('get-error');
          expect(endpoints[3].name).toEqual('broken');
          done();
        })
        .catch(e => done(e));
    });

    it('should return text of endpoint', (done) => {
      scriptmanager.get('endpoints', 'get-something')
        .then((endpoint) => {
          expect(endpoint).toEqual('something');
          done();
        })
        .catch(e => done(e));
    });

    it('should call endpoint and return result', (done) => {
      const req = {
        query: 'unicorn!',
        params: {
          name: 'get-query'
        }
      };
      scriptmanager.callEndpoint(req)
        .then((result) => {
          expect(result.status).toEqual(200);
          expect(result.body).toEqual('unicorn!');
          done();
        })
        .catch(e => done(e));
    });

    it('should call endpoint and return error', (done) => {
      const req = {
        params: {
          name: 'get-error'
        }
      };
      scriptmanager.callEndpoint(req)
        .then(() => done('bad then'))
        .catch((error) => {
          expect(error.message).toEqual('error');
          done();
        });
    });

    it('should call endpoint and catch error', (done) => {
      const req = {
        params: {
          name: 'broken'
        }
      };
      scriptmanager.callEndpoint(req)
        .catch((error) => {
          expect(error.name).toEqual('ValidationError');
          done();
        });
    });

    it('should add new endpoint', (done) => {
      scriptmanager.saveEndpoint(null, 'new-endpoint', 'new-handler')
        .then(() => {
          expect(data.endpoints.length).toEqual(5);
          expect(data.endpoints[4].name).toEqual('new-endpoint');
          expect(data.endpoints[4].handler).toEqual('new-handler');
          done();
        });
    });

    it('should update existing endpoint', (done) => {
      scriptmanager.saveEndpoint(0, 'updated-endpoint', 'updated-handler')
        .then(() => {
          expect(data.endpoints.length).toEqual(4);
          expect(data.endpoints[0].name).toEqual('updated-endpoint');
          expect(data.endpoints[0].handler).toEqual('updated-handler');
          done();
        });
    });

    it('should remove endpoint', (done) => {
      scriptmanager.deleteEndpoint(0)
        .then(() => {
          expect(data.endpoints.length).toEqual(3);
          expect(data.endpoints[0].name).toEqual('get-query');
          done();
        });
    });
  });
});
