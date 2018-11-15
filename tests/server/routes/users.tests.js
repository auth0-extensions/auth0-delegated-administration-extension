import _ from 'lodash';
import nock from 'nock';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import config from '../../../server/lib/config';
import users from '../../../server/routes/users';
import ScriptManager from '../../../server/lib/scriptmanager';
import { user, defaultUsers, defaultScripts, defaultConfig } from '../../utils/dummyData';

let userData = {};

describe('#users router', () => {
  config.setProvider((key) => defaultConfig[key], null);

  const fakeApiClient = (req, res, next) => {
    req.auth0 = {
      users: {
        getAll: (options) => {
          if (options.q && options.q.startsWith('(user_id:1)')) {
            return Promise.resolve({
              users: _.filter(userData, user => user.user_id === 1)
            });
          }
          if (options.sort) {
            const sortParts = options.sort.split(':');
            const order = sortParts[1] < 0 ? 'desc' : 'asc';
            return Promise.resolve({
              users: _.orderBy(userData, [sortParts[0]], [order])
            });
          }
          return Promise.resolve({ users: userData })
        },
        get: (options) => {
          const id = parseInt(options.id, 10) - 1;
          return Promise.resolve(userData[id]);
        },
        create: (data) => {
          if (data.memberships) return Promise.reject(new Error('did not fix memberships'));
          userData.push(data);
          return Promise.resolve();
        },
        delete: () => {
          userData.pop();
          return Promise.resolve();
        },
        update: (options, data) => {
          if (!data || Object.keys(data).length === 0) Promise.reject(new Error('can not pass empty data'));
          const id = parseInt(options.id, 10) - 1;
          if (data.email) userData[id].email = data.email;
          if (data.username) userData[id].username = data.username;
          if (data.password) userData[id].password = data.password;
          if (data.blocked !== undefined) userData[id].blocked = data.blocked;
          if (data.app_metadata) _.assign(userData[id].app_metadata, data.app_metadata);
          if (data.user_metadata) _.assign(userData[id].user_metadata, data.user_metadata);
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
    read: () => Promise.resolve(storage.data)
  };

  const scriptManager = new ScriptManager(storage);
  const oldGetCached = scriptManager.getCached;
  const skipCache = (type, name) => scriptManager.get(type, name);
  const settingsWithUserFields = ((ctx, callback) => {
    var result = {
      connections: [ 'conn-a', 'conn-b' ],
      dict: {
        title: ctx.request.user.email + ' dashboard',
        memberships: 'Groups'
      },
      css: 'http://localhost:3001/app/default.css',
      userFields: [
        {
          property: 'email',
          label: 'Email'
        }
      ]
    };
    callback(null, result);
  }).toString();

  const settingsWithValidationUserFields = ((ctx, callback) => {
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
          label: "Email",
          edit: {
            required: true,
            type: "text",
            validationFunction: ((value, values) => value !== "good value" ? "bad value" +
              " for" +
              " edit email" : false).toString()
          },
          create: {
            required: true,
            type: "text",
            validationFunction: ((value, values) => value !== "good value" ? "bad value for create email" : false).toString()
          }
        },
        {
          property: "username",
          label: "Username",
          edit: {
            required: true,
            type: "text",
            validationFunction: ((value, values) => value !== "good value" ? "bad value for edit username" : false).toString()
          },
          create: {
            required: true,
            type: "text",
            validationFunction: ((value, values) => value !== "good value" ? "bad value for create username" : false).toString()
          }
        },
        {
          property: "password",
          label: "Password",
          edit: {
            required: true,
            type: "password",
            validationFunction: ((value, values) => value !== "good value" ? "bad value for edit password" : false).toString()
          },
          create: {
            required: true,
            type: "password",
            validationFunction: ((value, values) => value !== "good value" ? "bad value for create password" : false).toString()
          }
        },
        {
          property: "repeatPassword",
          label: "Repeat Password",
          edit: {
            required: true,
            type: "password",
            validationFunction: ((value, values) => value !== "good value" ? "bad value for edit repeat password" : false).toString()
          },
          create: {
            required: true,
            type: "password",
            validationFunction: ((value, values) => value !== "good value" ? "bad value for create repeat password" : false).toString()
          }
        },
        {
          property: "user_metadata.custom",
          label: "Custom Field Simple Options",
          edit: {
            required: true,
            type: "select",
            options: ['good value', 'bad value'],
            component: 'InputCombo',
            validationFunction: ((value, values) => value !== "good value" && value !== "other value" ? "bad value for edit custom" : false).toString()
          },
          create: {
            required: true,
            type: "select",
            options: ['good value', 'bad value'],
            component: 'InputCombo',
            validationFunction: ((value, values) => value !== "good value" && value !== "other value" ? "bad value for create custom" : false).toString()
          }
        },
        {
          property: "user_metadata.custom2",
          label: "Custom Field Complex Options",
          edit: {
            required: true,
            type: "select",
            options: [{ value: 'good value', label: 'good' }, { value: 'bad value', label: 'bad' }],
            component: 'InputCombo',
            validationFunction: ((value, values) =>
              value && value !== "good value" &&
              value !== "other value" && value.value !== "good value" &&
              value.value !== "other value" ? "bad value for edit custom2" : false).toString()
          },
          create: {
            required: true,
            type: "select",
            options: [{ value: 'good value', label: 'good' }, { value: 'bad value', label: 'bad' }],
            component: 'InputCombo',
            validationFunction: ((value, values) =>
              value && value !== "good value" &&
              value !== "other value" && value.value !== "good value" &&
              value.value !== "other value" ? "bad value for create custom2" : false).toString()
          }
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

  beforeEach(() => {
    userData = _.cloneDeep(defaultUsers);
  });

  describe('#List', () => {
    it('should return "access denied" error', (done) => {
      request(app)
        .get('/users')
        .expect('Content-Type', /text/)
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });

    it('should return list of users', (done) => {
      const userFive = userData.pop();
      const userFour = userData.pop();

      request(app)
        .get('/users?sortProperty=user_id&sortOrder=-1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const targetUsers = _.orderBy(_.cloneDeep(userData), ['user_id'], ['desc']);
          userData.push(userFour);
          userData.push(userFive);
          expect(res.body).to.deep.equal({ users: targetUsers });

          done();
        });
    });

    it('should attempt to filter users by user_id', (done) => {
      request(app)
        .get('/users?filterBy=user_id&search=1')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.deep.equal({ users: [userData[0]] });
          done();
        });
    });
  });

  describe('#Get One', () => {
    it('should return user`s record', (done) => {
      nock(domain)
        .get(/user-blocks\/1/)
        .reply(200, { blocked_for: [ 'blah' ] });

      request(app)
        .get('/users/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.memberships).to.deep.equal(['deptA']);
          expect(res.body.user.user_id).to.equal(1);
          expect(res.body.user.blocked_for).to.deep.equal([ 'blah' ]);
          done();
        });
    });

    it('should return user`s record 2', (done) => {
      nock(domain)
        .get(/user-blocks\/2/)
        .reply(200, { blocked_for: [ ] });

      request(app)
        .get('/users/2')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.memberships).to.deep.equal(['deptA']);
          expect(res.body.user.user_id).to.equal(2);
          expect(res.body.user.blocked_for).to.deep.equal([ ]);
          done();
        });
    });

    it('should return user`s record 3', (done) => {
      nock(domain)
        .get(/user-blocks\/3/)
        .reply(200, { blocked_for: [ 'yummy' ] });

      request(app)
        .get('/users/3')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.memberships).to.deep.equal([]);
          expect(res.body.user.user_id).to.equal(3);
          expect(res.body.user.blocked_for).to.deep.equal([ 'yummy' ]);
          done();
        });
    });

    it('should return "not found" error', (done) => {
      request(app)
        .get('/users/10')
        .expect('Content-Type', /text/)
        .expect(404)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .get('/users/5')
        .expect('Content-Type', /text/)
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          expect(userData[5].email).to.equal(newUser.email);
          expect(userData[5].app_metadata.department).to.equal(newUser.memberships[0]);
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
          if (err) return done(err);
          expect(res.error.text).to.match(/The email address is required/);
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
          if (err) return done(err);
          expect(res.error.text).to.match(/The passwords do not match/);
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
          if (err) return done(err);
          done();
        });
    });
  });

  describe('#Delete', () => {
    it('should remove user', (done) => {
      userData[4].app_metadata.department = 'deptA';
      request(app)
        .delete('/users/5')
        .expect(204)
        .end((err) => {
          if (err) return done(err);
          expect(userData[4]).to.equal(undefined);
          done();
        });
    });

    it('should not remove current user', (done) => {
      request(app)
        .delete('/users/3')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.error.text).to.match(/You cannot delete yourself/);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .delete('/users/5')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
        .send({ password: 'password', repeatPassword: 'password' })
        .expect(204)
        .end((err) => {
          if (err) return done(err);
          expect(userData[0].password).to.equal('password');
          done();
        });
    });

    it('should return error if password not confirmed', (done) => {
      request(app)
        .put('/users/1/change-password')
        .send({ password: 'password', repeatPassword: '' })
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/change-password')
        .send({ password: 'password', repeatPassword: 'password' })
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          expect(userData[0].username).to.equal('name');
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/change-username')
        .send({ username: 'name' })
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          expect(userData[0].email).to.equal('new-user1@example.com');
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/change-email')
        .send({ email: 'name' })
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          expect(res.body).to.deep.equal({ devices: [] });
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .get('/users/5/devices')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .delete('/users/5/multifactor/provider')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          expect(userData[0].blocked).to.equal(true);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/block')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          expect(userData[0].blocked).to.equal(false);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .put('/users/5/unblock')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .post('/users/5/send-verification-email')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .post('/users/5/password-reset')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          expect(res.body).to.deep.equal([]);
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
          if (err) return done(err);
          expect(res.text).to.match(/something bad happened/);
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
          if (err) return done(err);
          expect(res.error.text).to.match(/Error: Request Error: 400/);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .get('/users/5/logs')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
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
          if (err) return done(err);
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
          if (err) return done(err);
          done();
        });
    });

    it('bad request on guardian get', (done) => {
      request(app)
        .del('/users/1/multifactor/guardian')
        .expect(404)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });

    it('should return "bad request" error bad provider', (done) => {
      request(app)
        .del('/users/1/multifactor/badProvider')
        .expect(500)
        .end((err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          expect(userData[0].app_metadata.someNewKey).to.equal('someNewValue');
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .patch('/users/5')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });

    it('should return "not found" error', (done) => {
      request(app)
        .patch('/users/6')
        .expect(404)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      request(app)
        .patch('/users/2')
        .expect(400)
        .end((err) => {
          if (err) return done(err);
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
        .send({ password: 'pwd1', repeatPassword: 'pwd1' })
        .expect(204)
        .end((err) => {
          if (err) return done(err);
          expect(userData[0].password).to.equal('pwd1');
          done();
        });
    });

    it('change-email', (done) => {
      request(app)
        .put('/users/1/change-email')
        .send({ email: 'new-user2@example.com' })
        .expect(204)
        .end((err, res) => {
          if (res.error.text) console.log(res.error.text);
          if (err) return done(err);
          expect(userData[0].email).to.equal('new-user2@example.com');
          done();
        });
    });

    it('change-username', (done) => {
      request(app)
        .put('/users/1/change-username')
        .send({ username: 'name2' })
        .expect(204)
        .end((err) => {
          if (err) return done(err);
          expect(userData[0].username).to.equal('name2');
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
        .send({ password: 'pwd12', repeatPassword: 'pwd12' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.error.text).to.match(/ValidationError: The password is required/);
          done();
        });
    });

    it('change-email', (done) => {
      request(app)
        .put('/users/1/change-email')
        .send({ email: 'new-user3@example.com' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.error.text).to.match(/ValidationError: The email is required/);
          done();
        });
    });

    it('change-username', (done) => {
      request(app)
        .put('/users/1/change-username')
        .send({ username: 'name3' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.error.text).to.match(/ValidationError: The username is required/);
          done();
        });
    });
  });

  describe('#userFields custom validation errors', () => {
    const newGoodUser = {
      email: 'good value',
      memberships: ['deptA'],
      password: 'good value',
      repeatPassword: 'good value',
      username: 'good value',
      user_metadata: {
        custom: 'good value',
        custom2: { label: 'good', value: 'good value' }
      },
      app_metadata: { department: 'deptA' }
    };

    before(() => {
      scriptManager.getCached = skipCache;
      storage.data.scripts.settings = settingsWithValidationUserFields;

      storage.data.scripts.create = ((ctx, callback) => {
        if (ctx.payload.memberships) {
          ctx.payload.app_metadata.memberships = ctx.payload.memberships;
          delete ctx.payload.memberships;
        }
        callback(null, ctx.payload);
      }).toString();
    });

    const catchError = (done, assertMethod) => {
      try {
        assertMethod();
        done();
      } catch (e) {
        done(e);
      }
    };

    it('create user: pass validation', (done) => {
      const targetUser = _.cloneDeep(newGoodUser);
      targetUser.app_metadata.memberships = newGoodUser.memberships;
      delete targetUser.memberships;
      delete targetUser.repeatPassword;
      request(app)
        .post('/users')
        .send(newGoodUser)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          const postedUser = userData[5];
          expect(postedUser).to.deep.equal(targetUser);
          done();
        });
    });

    it('create profile: required', (done) => {
      const badUser = _.cloneDeep(newGoodUser);
      delete badUser.user_metadata.custom;
      delete badUser.user_metadata.custom2;
      request(app)
        .post('/users')
        .send(badUser)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: required/);
            expect(res.error.text).to.match(/Custom Field Complex Options: required/);
          });
        });

    });

    it('create profile: required languageDictionary', (done) => {
      const badUser = _.cloneDeep(newGoodUser);
      delete badUser.user_metadata.custom;
      delete badUser.user_metadata.custom2;
      request(app)
        .post('/users?requiredErrorText=requiredtext')
        .send(badUser)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: requiredtext/);
            expect(res.error.text).to.match(/Custom Field Complex Options: requiredtext/);
          });
        });
    });

    it('create profile: fail validation: validationFunction', (done) => {
      const badUser = _.cloneDeep(newGoodUser);
      badUser.user_metadata.custom = 'bad value';
      badUser.user_metadata.custom2 = { label: 'bad', value: 'bad value' };

      request(app)
        .post('/users')
        .send(badUser)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: bad value for create custom/);
            expect(res.error.text).to.match(/Custom Field Complex Options: bad value for create custom2/);
          });
        });
    });

    it('create profile: fail validation: validationFunction', (done) => {
      const badUser = _.cloneDeep(newGoodUser);
      badUser.user_metadata.custom = 'bad value';
      badUser.user_metadata.custom2 = 'bad value';

      request(app)
        .post('/users')
        .send(badUser)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: bad value for create custom/);
            expect(res.error.text).to.match(/Custom Field Complex Options: bad value for create custom2/);
          });
        });
    });

    it('create profile: fail validation: not an option', (done) => {
      const badUser = _.cloneDeep(newGoodUser);
      badUser.user_metadata.custom = 'other value';
      badUser.user_metadata.custom2 = { label: 'other', value: 'other value' };

      request(app)
        .post('/users')
        .send(badUser)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: other value is not an allowed option/);
            expect(res.error.text).to.match(/Custom Field Complex Options: other value is not an allowed option/);
          });
        });
    });

    it('create profile: fail validation: not an option', (done) => {
      const badUser = _.cloneDeep(newGoodUser);
      badUser.user_metadata.custom = 'other value';
      badUser.user_metadata.custom2 = 'other value';

      request(app)
        .post('/users')
        .send(badUser)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: other value is not an allowed option/);
            expect(res.error.text).to.match(/Custom Field Complex Options: other value is not an allowed option/);
          });
        });
    });

    it('create profile: pass validation: option object', (done) => {
      const badUser = _.cloneDeep(newGoodUser);
      badUser.user_metadata.custom = 'other value';
      badUser.user_metadata.custom2 = 'other value';

      request(app)
        .post('/users')
        .send(badUser)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: other value is not an allowed option/);
            expect(res.error.text).to.match(/Custom Field Complex Options: other value is not an allowed option/);
          });
        });
    });

    it('change profile: required', (done) => {
      userData[0] = newGoodUser;

      request(app)
        .patch(`/users/1`)
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: required/);
            expect(res.error.text).to.match(/Custom Field Complex Options: required/);
          });
        });
    });

    it('change profile: required, languageDictionary', (done) => {
      userData[0] = newGoodUser;

      request(app)
        .patch(`/users/1?requiredErrorText=requiredtext`)
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: requiredtext/);
            expect(res.error.text).to.match(/Custom Field Complex Options: requiredtext/);
          });
        });
    });

    it('change profile: fail validation: validationFunction', (done) => {
      userData[0] = newGoodUser;

      request(app)
        .patch(`/users/1`)
        .send({ user_metadata: { custom: 'bad value', custom2: 'bad value' } })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: bad value for edit custom/);
            expect(res.error.text).to.match(/Custom Field Complex Options: bad value for edit custom2/);
          });
        });
    });

    it('change profile: fail validation: not an option', (done) => {
      userData[0] = newGoodUser;

      request(app)
        .patch(`/users/1`)
        .send({ user_metadata: { custom: 'other value', custom2: 'other value' } })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            expect(res.error.text).to.match(/Custom Field Simple Options: other value is not an allowed option/);
            expect(res.error.text).to.match(/Custom Field Complex Options: other value is not an allowed option/);
          });
        });
    });

    it('change profile: pass validation', (done) => {
      userData[0] = newGoodUser;
      userData[0].user_metadata = {};

      request(app)
        .patch(`/users/1`)
        .send({ user_metadata: { custom: 'good value', custom2: 'good value' } })
        .expect(204)
        .end((err, res) => {
          if (res.error.text) console.log(res.error.text);
          if (err) return done(err);
          expect(userData[0].user_metadata.custom).to.equal('good value');
          expect(userData[0].user_metadata.custom2).to.equal('good value');
          done();
        });
    });

    const testCreate = (user, regexObject, done) => {
      request(app)
        .post('/users')
        .send(user)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            if (_.isArray(regexObject)) {
              return regexObject.forEach(thisRegex =>
                expect(res.error.text).to.match(thisRegex)
              );
            }
            expect(res.error.text).to.match(regexObject);
          });
        });
    };

    const mapPropertyToEndpoint = {
      email: 'change-email',
      username: 'change-username',
      password: 'change-password'
    };

    const testEditFail = (property, user, regexObject, done, requiredText) => {
      userData[0] = newGoodUser;

      const url = `/users/1/${mapPropertyToEndpoint[property]}${requiredText ? `?requiredErrorText=${requiredText}` : ''}`;
      request(app)
        .put(url)
        .send(user)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          catchError(done, () => {
            if (_.isArray(regexObject)) {
              return regexObject.forEach(thisRegex =>
                expect(res.error.text).to.match(thisRegex)
              );
            }
            expect(res.error.text).to.match(regexObject);
          });
        });
    };

    const testEditPass = (property, user, done) => {
      userData[0] = newGoodUser;

      const url = `/users/1/${mapPropertyToEndpoint[property]}`;
      request(app)
        .put(url)
        .send(user)
        .expect(204)
        .end((err, res) => {
          if (res.error.text) console.log(res.error.text);
          if (err) return done(err);
          done();
        });
    };

    const testCreateRequired = (property, label, done) => {
      const badUser = _.cloneDeep(newGoodUser);
      delete badUser[property];
      let regexObject = new RegExp(`${label}: required`);
      if (property === 'password') {
        delete badUser['repeatPassword'];
        regexObject = [
          regexObject,
          new RegExp(`Repeat Password: required`)
        ]
      }
      testCreate(badUser, regexObject, done);
    };

    const testCreateFailValidation = (property, label, done) => {
      const badUser = _.cloneDeep(newGoodUser);
      badUser[property] = 'bad value';
      let regexObject = new RegExp(`${label}: bad value for create ${property}`);
      if (property === 'password') {
        badUser['repeatPassword'] = 'bad value';
        regexObject = [
          regexObject,
          new RegExp(`Repeat Password: bad value for create repeat password`)
        ]
      }
      testCreate(badUser, regexObject, done);
    };

    const testEditRequired = (property, label, done) => {
      const badUser = {};
      let regexObject = new RegExp(`${label}: required`);
      if (property === 'password') {
        regexObject = [
          regexObject,
          new RegExp(`Repeat Password: required`)
        ]
      }
      testEditFail(property, badUser, regexObject, done);
    };

    const testEditRequiredText = (property, label, done) => {
      const badUser = {};
      let regexObject = new RegExp(`${label}: requiredtext`);
      if (property === 'password') {
        regexObject = [
          regexObject,
          new RegExp(`Repeat Password: requiredtext`)
        ]
      }
      testEditFail(property, badUser, regexObject, done, 'requiredtext');
    };

    const testEditFailValidation = (property, label, done) => {
      const badUser = { [property]: 'bad value' };
      let regexObject = new RegExp(`${label}: bad value for edit ${property}`);
      if (property === 'password') {
        badUser.repeatPassword = 'bad value';
        regexObject = [
          regexObject,
          new RegExp(`Repeat Password: bad value for edit repeat password`)
        ]
      }
      testEditFail(property, badUser, regexObject, done);
    };

    const testEditPassValidation = (property, label, done) => {
      const goodUser = { [property]: 'good value' };
      if (property === 'password') goodUser.repeatPassword = 'good value';
      testEditPass(property, goodUser, done);
    };

    it('create email: required', (done) => {
      testCreateRequired('email', 'Email', done);
    });

    it('create email: fail validation', (done) => {
      testCreateFailValidation('email', 'Email', done);
    });

    it('change email: required', (done) => {
      testEditRequired('email', 'Email', done);
    });

    it('change email: required, language', (done) => {
      testEditRequiredText('email', 'Email', done);
    });

    it('change email: fail validation', (done) => {
      testEditFailValidation('email', 'Email', done);
    });

    it('change email: pass validation', (done) => {
      testEditPassValidation('email', 'Email', done);
    });

    it('create username: required', (done) => {
      testCreateRequired('username', 'Username', done);
    });

    it('create username: fail validation', (done) => {
      testCreateFailValidation('username', 'Username', done);
    });

    it('change username: required', (done) => {
      testEditRequired('username', 'Username', done);
    });

    it('change username: required, language', (done) => {
      testEditRequiredText('username', 'Username', done);
    });

    it('change username: fail validation', (done) => {
      testEditFailValidation('username', 'Username', done);
    });

    it('change username: pass validation', (done) => {
      testEditPassValidation('username', 'Username', done);
    });

    it('create password: required', (done) => {
      testCreateRequired('password', 'Password', done);
    });

    it('create password: fail validation', (done) => {
      testCreateFailValidation('password', 'Password', done);
    });

    it('change password: required', (done) => {
      testEditRequired('password', 'Password', done);
    });

    it('change password: required, language', (done) => {
      testEditRequiredText('password', 'Password', done);
    });

    it('change password: fail validation', (done) => {
      testEditFailValidation('password', 'Password', done);
    });

    it('change password: pass validation', (done) => {
      testEditPassValidation('password', 'Password', done);
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
          if (err) return done(err);
          expect(res.error.text).to.match(/Error: intentional error/);
          done();
        });
    });
  });

  describe('#write hook sets extra field for change password', () => {
    before(() => {
      scriptManager.getCached = skipCache;
      storage.data.scripts = _.cloneDeep(defaultScriptData.scripts);
      storage.data.scripts.settings = ((ctx, callback) => callback(null, { userFields: [] }));
      storage.data.scripts.create = ((ctx, callback) => {
        const _ = require('lodash');
        const user = ctx.payload;
        user.app_metadata = user.app_metadata || {};
        user.app_metadata.passwordReset = 'just now';
        callback(null, user);
      }).toString();
    });

    it('change-password success', (done) => {
      request(app)
        .put('/users/1/change-password')
        .send({ password: 'pwd13', repeatPassword: 'pwd13' })
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          expect(userData[0].password).to.equal('pwd13');
          expect(userData[0].app_metadata.passwordReset).to.equal('just now');
          done();
        });
    });

    it('change-password success, can not pass in app_metadata', (done) => {
      request(app)
        .put('/users/1/change-password')
        .send({ password: 'pwd13', repeatPassword: 'pwd13', app_metadata: { someKey: 'someValue' } })
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          const user = userData[0];
          expect(user.password).to.equal('pwd13');
          expect(user.app_metadata.someKey).to.equal(undefined);
          done();
        });
    });
  });

  describe('#create with no write hook', () => {
    before(() => {
      scriptManager.getCached = skipCache;
      storage.data.scripts = _.cloneDeep(defaultScriptData.scripts);
      storage.data.scripts.create = null;
    });

    it('create success', (done) => {
      const id = userData.length;

      request(app)
        .post('/users')
        .send({ password: 'pwd13', repeatPassword: 'pwd13', email: 'test@email.com', memberships: [] })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(userData[id].password).to.equal('pwd13');
          expect(userData[id].email).to.equal('test@email.com');
          done();
        });
    });
  });

});
