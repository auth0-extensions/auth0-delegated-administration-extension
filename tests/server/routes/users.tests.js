import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import users from '../../../server/routes/users';
import ScriptManager from '../../../server/lib/scriptmanager';


describe('#users router', () => {
  const defaultScripts = {
    access: "function(ctx, callback) { var hasAccess = (ctx.request.user.app_metadata && ctx.payload.user.app_metadata && ctx.payload.user.app_metadata.department && ctx.request.user.app_metadata.department === ctx.payload.user.app_metadata.department); if (!hasAccess) { return callback(new Error('No access.')); } return callback();}",
    filter: "function(ctx, callback) { var department = (ctx.request.user && ctx.request.user.app_metadata.department) ? ctx.request.user.app_metadata.department : null; if (!department || !department.length) { return callback(new Error('The current user is not part of any department.')); } return callback(null, 'app_metadata.delegated-admin.department:\"' + department + '\"');}",
    create: "function(ctx, callback) { if (!ctx.payload.group) { return callback(new Error('The user must be created within a department.')); } var currentDepartment = ctx.request.user.app_metadata.department; if (!currentDepartment || !currentDepartment.length) { return callback(new Error('The current user is not part of any department.')); } if (ctx.payload.group !== currentDepartment) { return callback(new Error('You can only create users within your own department.'));}return callback(null, {email: ctx.payload.email, password: ctx.payload.password, connection: ctx.payload.connection, app_metadata: { department: ctx.payload.group } });}",
    memberships: "function (ctx, callback) { var parsedData = []; if (ctx.request.user.app_metadata && ctx.request.user.app_metadata && ctx.request.user.app_metadata.department) { var data = ctx.request.user.app_metadata.department; parsedData = (Array.isArray(data)) ? data : data.replace(', ', ',', 'g').split(','); } callback(null, parsedData); }",
    settings: "function (ctx, callback) { var result = { dict: { title: ctx.request.user.email + ' dashboard', memberships: 'Groups' }, css: 'http://localhost:3001/app/default.css' } if (ctx.request.user.app_metadata && ctx.request.user.app_metadata.department) { result.title = ctx.request.user.app_metadata.department + ' dashboard'; result.css = 'http://localhost:3001/app/' + ctx.request.user.app_metadata.department + '.css';} callback(null, result);}"
  };

  const user = {
    app_metadata: { department: 'deptA' },
    role: 1
  };

  const defaultUsers = [
    { email: 'user1@example.com', user_id: 1, app_metadata: { department: 'deptA' } },
    { email: 'user2@example.com', user_id: 2, app_metadata: { department: 'deptA' } },
    { email: 'user3@example.com', user_id: 3, app_metadata: { department: 'deptA' } },
    { email: 'user4@example.com', user_id: 4, app_metadata: { department: 'deptB' } },
    { email: 'user5@example.com', user_id: 5, app_metadata: { department: 'deptB' } }
  ];

  const fakeApiClient = (req, res, next) => {
    req.auth0 = {
      users: {
        getAll: () => Promise.resolve({ users: defaultUsers }),
        get: (options) => {
          const id = parseInt(options.id, 10) - 1;
          return Promise.resolve(defaultUsers[id]);
        },
        create: (data) => {
          defaultUsers.push(data);
          return Promise.resolve();
        },
        delete: () => {
          defaultUsers.pop();
          return Promise.resolve();
        },
        update: (options, data) => {
          const id = parseInt(options.id, 10) - 1;
          if (data.email) defaultUsers[id].email = data.email;
          if (data.username) defaultUsers[id].username = data.username;
          if (data.password) defaultUsers[id].password = data.password;
          if (data.blocked !== undefined) defaultUsers[id].blocked = data.blocked;
          return Promise.resolve();
        },
        deleteMultifactorProvider: () => Promise.resolve()
      },
      deviceCredentials: {
        getAll: () => Promise.resolve([])
      },
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

  const storage = {
    read: () => Promise.resolve(storage.data),
    write: (obj) => {
      storage.data = obj;
    },
    data: {
      scripts: {
        access: defaultScripts.access,
        filter: defaultScripts.filter,
        create: defaultScripts.create,
        memberships: defaultScripts.memberships,
        settings: defaultScripts.settings
      }
    }
  };

  const scriptManager = new ScriptManager(storage);

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/users', fakeApiClient, addUserToReq, users(storage, scriptManager));

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
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual({ users: defaultUsers });

          defaultUsers.push(userFour);
          defaultUsers.push(userFive);
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
          expect(res.body.memberships).toEqual([ 'deptA' ]);
          expect(res.body.user.user_id).toEqual(1);
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
        group: 'deptA'
      };

      request(app)
        .post('/users')
        .send(newUser)
        .expect(201)
        .end((err) => {
          if (err) throw err;
          expect(defaultUsers[5].email).toEqual(newUser.email);
          expect(defaultUsers[5].app_metadata.department).toEqual(newUser.group);
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      const newUser = {
        email: 'user7@example.com',
        group: 'deptB'
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
    it('should change user`s email', (done) => {
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
});
