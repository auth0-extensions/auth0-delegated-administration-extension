import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import logs from '../../../server/routes/logs';
import ScriptManager from '../../../server/lib/scriptmanager';
import { user, defaultLogs, defaultUsers, defaultScripts } from '../../utils/dummyData';
import * as constants from '../../../server/constants';


describe('#logs router', () => {
  const fakeApiClient = (req, res, next) => {
    req.auth0 = {
      users: {
        get: (options) => {
          const id = parseInt(options.id, 10) - 1;
          return Promise.resolve(defaultUsers[id]);
        }
      },
      logs: {
        getAll: () => Promise.resolve(defaultLogs),
        get: (options) => {
          const id = parseInt(options.id, 10) - 1;
          return Promise.resolve(defaultLogs[id]);
        }
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
  app.use('/logs', fakeApiClient, addUserToReq, logs(scriptManager));

  describe('#List', () => {
    it('should return "access denied" error', (done) => {
      request(app)
        .get('/logs')
        .expect('Content-Type', /text/)
        .expect(403)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return list of logs for advanced user', (done) => {
      user.scope = constants.LOGSUSER_PERMISSION;

      const result = request(app)
        .get('/logs');
      result
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(defaultLogs);
          done();
        });
    });
  });

  describe('#Read One', () => {
    it('should return log record', (done) => {
      request(app)
        .get('/logs/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual({ log: defaultLogs[0] });
          done();
        });
    });

    it('should return log record for advanced user', (done) => {
      user.scope = constants.USER_PERMISSION;

      request(app)
        .get('/logs/2')
        .expect('Content-Type', /text/)
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "access denied" error', (done) => {
      user.scope = constants.USER_PERMISSION;

      request(app)
        .get('/logs/2')
        .expect('Content-Type', /text/)
        .expect(400)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "Invalid log record" error', (done) => {
      request(app)
        .get('/logs/3')
        .expect('Content-Type', /text/)
        .expect(500)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });

    it('should return "Not found" error', (done) => {
      request(app)
        .get('/logs/4')
        .expect('Content-Type', /text/)
        .expect(404)
        .end((err) => {
          if (err) throw err;
          done();
        });
    });
  });
});
