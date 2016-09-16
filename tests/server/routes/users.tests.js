const path = require('path');
const Promise = require('bluebird');
const request = require('supertest');
const express = require('express');
const nconf = require('nconf');
import { middlewares } from 'auth0-extension-express-tools';

import config from '../../../server/lib/config';
import users from '../../../server/routes/users';
import ScriptManager from '../../../server/lib/scriptmanager';


describe('#users', () => {
  nconf
    .argv()
    .env()
    .file(path.join(__dirname, '../../../server/config.json'))
    .defaults({
      DATA_CACHE_MAX_AGE: 1000 * 10,
      NODE_ENV: 'test',
      HOSTING_ENV: 'default',
      PORT: 3000,
      TITLE: 'User Management'
    });

  config.setProvider((key) => nconf.get(key), null);

  const managementApiClient = middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  });

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

  app.use('/users', managementApiClient, users(storage, scriptManager));

  it('should get list of users', (done) => {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err) => {
        if (err) throw err;
        done();
      });
  });
});
