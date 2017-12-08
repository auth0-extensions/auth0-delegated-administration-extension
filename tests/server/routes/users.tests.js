import _ from 'lodash';
import nock from 'nock';
import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import config from '../../../server/lib/config';
import users from '../../../server/routes/users';
import ScriptManager from '../../../server/lib/scriptmanager';
import { user, defaultUsers, defaultScripts, defaultConfig } from '../../utils/dummyData';

describe('#users router', () => {
  config.setProvider((key) => defaultConfig[key], null);

  const fakeApiClient = (req, res, next) => {
    req.auth0 = {
      users: {
        getAll: (options) => {
          if (options.q && options.q.startsWith('(user_id:"1")')) {
            return Promise.resolve({
              users: _.filter(defaultUsers, user => user.user_id === 1)
            });
          }
          if (options.sort) {
            const sortParts = options.sort.split(':');
            const order = sortParts[1] < 0 ? 'desc' : 'asc';
            return Promise.resolve({
              users: _.sortByOrder(defaultUsers, [sortParts[0]], [order])
            });
          }
          return Promise.resolve({ users: defaultUsers })
        },
        get:
          (options) => {
            const id = parseInt(options.id, 10) - 1;
            return Promise.resolve(defaultUsers[id]);
          },
        create:
          (data) => {
            defaultUsers.push(data);
            return Promise.resolve();
          },
        delete:
          () => {
            defaultUsers.pop();
            return Promise.resolve();
          },
        update:
          (options, data) => {
            const id = parseInt(options.id, 10) - 1;
            if (data.email) defaultUsers[id].email = data.email;
            if (data.username) defaultUsers[id].username = data.username;
            if (data.password) defaultUsers[id].password = data.password;
            if (data.blocked !== undefined) defaultUsers[id].blocked = data.blocked;
            if (data.app_metadata) _.assign(defaultUsers[id].app_metadata, data.app_metadata);
            return Promise.resolve();
          },
        deleteMultifactorProvider:
          (options) => options.provider !== 'badProvider' ?
            Promise.resolve() :
            Promise.reject(new Error('bad provider'))
      },
      deviceCredentials: {
        getAll: () => Promise.resolve([])
      }
      ,
      jobs: {
        verifyEmail: () => Promise.resolve([])
      }
    };

    next();
  };

  const addUserToReq = (req, res, next) => {
    req.user = user;
    next();
  };

  const defaultScriptData = {
    scripts: {
      access: defaultScripts.access,
      filter: defaultScripts.filter,
      create: defaultScripts.create,
      memberships: defaultScripts.memberships,
      settings: defaultScripts.settings
    }
  };

  const storage = {
    read: () => Promise.resolve(storage.data),
  };

  const scriptManager = new ScriptManager(storage);
  const oldGetCached = scriptManager.getCached;
  const skipCache = name => scriptManager.get(name);
  const settingsWithUserFields = ((ctx, callback) => {
    var result = {
      connections: ['conn-a', 'conn-b'],
      dict: {
        title: ctx.request.user.email + ' dashboard',
        memberships: 'Groups'
      },
      css: 'http://localhost:3001/app/default.css',
      userFields: [
        {
          property: "email",
          label: "Email"
        }
      ]
    };
    callback(null, result);
  }).toString();

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/users', fakeApiClient, addUserToReq, users(storage, scriptManager));
  const domain = new RegExp(config('AUTH0_DOMAIN'));

  before(() => {
    nock(domain)
      .post('/oauth/token')
      .reply(200, { ok: true, access_token: 'access_token' });

    storage.data = _.cloneDeep(defaultScriptData);
    scriptManager.getCached = oldGetCached;
  });

  describe('#List', () => {
    it('should return "access denied" error', (done) => {
      request(app)
        .get('/users')
        .expect('Content-Type', /text/)
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return list of users', (done) => {
      const userFive = defaultUsers.pop();
      const userFour = defaultUsers.pop();

      request(app)
        .get('/users?sortProperty=user_id&sortOrder=-1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          const targetUsers = _.sortByOrder(_.cloneDeep(defaultUsers), ['user_id'],['desc']);
          defaultUsers.push(userFour);
          defaultUsers.push(userFive);
          expect(res.body).toEqual({ users: targetUsers });

          done();
        });
    });

    it('should attempt to filter users by user_id', (done) => {
      request(app)
        .get('/users?filterBy=user_id&search=1')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual({ users: [defaultUsers[0]] });
          done();
        });
    });
  });

  describe('#Get One', () => {
    it('should return user`s record', (done) => {
      request(app)
        .get('/users/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.memberships).toEqual(['deptA']);
          expect(res.body.user.user_id).toEqual(1);
          done();
        });
    });

    it('should return user`s record 2', (done) => {
      request(app)
        .get('/users/2')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.memberships).toEqual(['deptA']);
          expect(res.body.user.user_id).toEqual(2);
          done();
        });
    });

    it('should return user`s record 3', (done) => {
      request(app)
        .get('/users/3')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.memberships).toEqual([]);
          expect(res.body.user.user_id).toEqual(3);
          done();
        });
    });

    it('should return "not found" error', (done) => {
      request(app)
        .get('/users/10')
        .expect('Content-Type', /text/)
        .expect(404)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .get('/users/5')
        .expect('Content-Type', /text/)
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Create', () => {
    it('should create new user', (done) => {
      const newUser = {
        email: 'user6@example.com',
        memberships: ['deptA']
      };

      request(app)
        .post('/users')
        .send(newUser)
        .expect(201)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[5].email).toEqual(newUser.email);
          expect(defaultUsers[5].app_metadata.department).toEqual(newUser.memberships[0]);
          done();
        });
    });

    it('should return "The email address is required" error', (done) => {
      const newUser = {
        email: '',
        memberships: ['deptA']
      };

      request(app)
        .post('/users')
        .send(newUser)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.error).toMatch(/The email address is required/);
          done();
        });
    });

    it('should return "The passwords do not match" error', (done) => {
      const newUser = {
        email: 'user7@example.com',
        password: 'password',
        repeatPassword: 'repeatPassword',
        memberships: ['deptA']
      };

      request(app)
        .post('/users')
        .send(newUser)
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.error).toMatch(/The passwords do not match/);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      const newUser = {
        email: 'user7@example.com',
        memberships: ['deptB']
      };

      request(app)
        .post('/users')
        .send(newUser)
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Delete', () => {
    it('should remove user', (done) => {
      request(app)
        .delete('/users/6')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[5]).toEqual(undefined);
          done();
        });
    });

    it('should not remove current user', (done) => {
      request(app)
        .delete('/users/3')
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.error).toMatch(/You cannot delete yourself/);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .delete('/users/5')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Change Password', () => {
    it('should change user`s password', (done) => {
      nock(domain)
        .post('/dbconnections/change_password')
        .reply(204);

      request(app)
        .put('/users/1/change-password')
        .send({ password: 'password', confirmPassword: 'password' })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].password).toEqual('password');
          done();
        });
    });

    it('should return error if password not confirmed', (done) => {
      request(app)
        .put('/users/1/change-password')
        .send({ password: 'password', confirmPassword: '' })
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/change-password')
        .send({ password: 'password', confirmPassword: 'password' })
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Change Username', () => {
    it('should change user`s name', (done) => {
      storage.data = _.cloneDeep(defaultScriptData);
      request(app)
        .put('/users/1/change-username')
        .send({ username: 'name' })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].username).toEqual('name');
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/change-username')
        .send({ username: 'name' })
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Change Email', () => {
    it('should change users email', (done) => {
      request(app)
        .put('/users/1/change-email')
        .send({ email: 'new-user1@example.com' })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].email).toEqual('new-user1@example.com');
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/change-email')
        .send({ email: 'name' })
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Get Devices', () => {
    it('should return list of devices', (done) => {
      request(app)
        .get('/users/1/devices')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual({ devices: [] });
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .get('/users/5/devices')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Remove MFA', () => {
    it('should remove MFA', (done) => {
      request(app)
        .delete('/users/1/multifactor/provider')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .delete('/users/5/multifactor/provider')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Blocking User', () => {
    it('should block user', (done) => {
      request(app)
        .put('/users/1/block')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].blocked).toEqual(true);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/block')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Unblocking User', () => {
    it('should unblock user', (done) => {
      request(app)
        .put('/users/1/unblock')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].blocked).toEqual(false);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/unblock')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Verify Email', () => {
    it('should send verification email', (done) => {
      request(app)
        .post('/users/1/send-verification-email')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .post('/users/5/send-verification-email')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Password reset', () => {
    it('should reset password', (done) => {
      request(app)
        .post('/users/1/password-reset')
        .send({ connection: 'connection' })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .post('/users/5/password-reset')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Logs for user', () => {
    it('should return list of logs', (done) => {
      nock(domain)
        .get(/logs/)
        .reply(200, []);

      request(app)
        .get('/users/1/logs')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual([]);
          done();
        });
    });

    it('should return list of logs 2', (done) => {
      nock(domain)
        .get(/logs/)
        .replyWithError('something bad happened');

      request(app)
        .get('/users/1/logs')
        .expect(500)
        .end((err, res) => {
          expect(res.text).toMatch(/something bad happened/);
          done();
        });
    });

    it('should return "bad request" error', (done) => {
      nock(domain)
        .get(/logs/)
        .reply(400, []);

      request(app)
        .get('/users/1/logs')
        .expect(500)
        .end((err, res) => {
          expect(res.error).toMatch(/Error: Request Error: 400/);
          if (err) throw err;
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .get('/users/5/logs')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#Remove Multifactor guardian', () => {
    it('delete guardian', (done) => {
      nock(domain)
        .get(/1\/enrollments/)
        .reply(200, [{ id: 1 }]);

      nock(domain)
        .delete(/enrollments\/1/)
        .reply(204);

      request(app)
        .del('/users/1/multifactor/guardian')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('delete guardian attempt when enrollment already gone', (done) => {
      nock(domain)
        .get(/2\/enrollments/)
        .reply(200, []);

      request(app)
        .del('/users/2/multifactor/guardian')
        .expect(204)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('bad request on guardian delete', (done) => {
      nock(domain)
        .get(/3\/enrollments/)
        .reply(200, [{ id: 1 }]);

      request(app)
        .del('/users/3/multifactor/guardian')
        .expect(404)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('bad request on guardian get', (done) => {
      request(app)
        .del('/users/1/multifactor/guardian')
        .expect(404)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "bad request" error bad provider', (done) => {
      request(app)
        .del('/users/1/multifactor/badProvider')
        .expect(500)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });

  describe('#User patch', () => {
    it('patch user successfully', (done) => {
      request(app)
        .patch('/users/1')
        .send({
          app_metadata: {
            someNewKey: 'someNewValue'
          }
        })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].app_metadata.someNewKey).toEqual('someNewValue');
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .patch('/users/5')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "not found" error', (done) => {
      request(app)
        .patch('/users/6')
        .expect(404)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .patch('/users/2')
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

  });

  describe('#userFields should call write hook', () => {
    before(() => {
      scriptManager.getCached = skipCache;
      storage.data.scripts.settings = settingsWithUserFields;

      storage.data.scripts.create = ((ctx, callback) => {
        if (!ctx.userFields) throw Error('write hook should get userFields');

        callback(null, { email: ctx.payload.email, password: ctx.payload.password, username: ctx.payload.username });
      }).toString();
    });

    it('change-password', (done) => {
      request(app)
        .put('/users/1/change-password')
        .send({ password: 'pwd1', confirmPassword: 'pwd1' })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].password).toEqual('pwd1');
          done();
        });
    });

    it('change-email', (done) => {
      request(app)
        .put('/users/1/change-email')
        .send({ email: 'new-user2@example.com' })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].email).toEqual('new-user2@example.com');
          done();
        });
    });

    it('change-username', (done) => {
      request(app)
        .put('/users/1/change-username')
        .send({ username: 'name2' })
        .expect(204)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[0].username).toEqual('name2');
          done();
        });
    });

  });

  describe('#userFields defined validation errors', () => {
    before(() => {
      scriptManager.getCached = skipCache;
      storage.data.scripts.settings = settingsWithUserFields;

      storage.data.scripts.create = ((ctx, callback) => {
        callback(null, {});
      }).toString();
    });

    it('change-password', (done) => {
      request(app)
        .put('/users/1/change-password')
        .send({ password: 'pwd12', confirmPassword: 'pwd12' })
        .expect(500)
        .end((err, res) => {
          expect(res.error).toMatch(/ValidationError: The password is required/);
          done();
        });
    });

    it('change-email', (done) => {
      request(app)
        .put('/users/1/change-email')
        .send({ email: 'new-user3@example.com' })
        .expect(500)
        .end((err, res) => {
          expect(res.error).toMatch(/ValidationError: The email is required/);
          done();
        });
    });

    it('change-username', (done) => {
      request(app)
        .put('/users/1/change-username')
        .send({ username: 'name3' })
        .expect(500)
        .end((err, res) => {
          expect(res.error).toMatch(/ValidationError: The username is required/);
          done();
        });
    });
  });

  describe('#extra errors', () => {
    before(() => {
      scriptManager.getCached = skipCache;
      storage.data.scripts.memberships = ((ctx, callback) => {
        callback(new Error('intentional error'));
      }).toString();
    });

    it('get-by-id', (done) => {
      request(app)
        .get('/users/1')
        .expect(400)
        .end((err, res) => {
          expect(res.error).toMatch(/Error: intentional error/);
          done();
        });
    });
  });
});
