const expect = require('expect');
const Promise = require('bluebird');

import Users from '../../../server/lib/users';
import ScriptManager from '../../../server/lib/scriptmanager';

describe('#users', () => {
  let request;

  const storage = {
    read: () => Promise.resolve(storage.data),
    write: (obj) => {
      storage.data = obj;
    },
    data: {
      scripts: {}
    }
  };

  const scriptManager = new ScriptManager(storage);
  const users = new Users(scriptManager);

  beforeEach(() => {
    request = {
      data: {},
      auth0: {
        users: {
          create: (data) => {
            request.data = data;
          },
          getAll: () => Promise.resolve({ users: [] })
        }
      }
    };
  });

  describe('#Users routing', () => {
    it('should create user', (done) => {
      const userData = {
        email: 'some@email.com',
        connection: 'connection',
        group: 'group',
        password: 'password'
      };

      const res = {
        status: () => res,
        send: () => {
          expect(request.data).toEqual(userData);
          done();
        }
      };

      request.body = userData;

      users.create(request, res);
    });

    it('should list users', (done) => {
      const res = {
        json: (data) => {
          expect(data.users).toEqual([]);
          done();
        }
      };

      request.query = {};

      users.getAll(request, res);
    });
  });
});
