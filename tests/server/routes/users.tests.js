const expect = require('expect');
const Promise = require('bluebird');
const request = require('supertest');
const express = require('express');

import users from '../../../server/routes/users';
import ScriptManager from '../../../server/lib/scriptmanager';


describe('#users', () => {
  const fakeApiClient = (req, res, next) => {
    req.auth0 = {
      users: {
        getAll: () => Promise.resolve({ users: [] })
      }
    };

    next();
  };

  const app = express();
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

  app.use('/users', fakeApiClient, users(storage, scriptManager));

  it('should get list of users', (done) => {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body).toEqual({ users: [] });
        done();
      });
  });
});
