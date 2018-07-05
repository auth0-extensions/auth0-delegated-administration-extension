import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import connections from '../../../server/routes/connections';
import ScriptManager from '../../../server/lib/scriptmanager';
import { user, defaultConnections, defaultScripts } from '../../utils/dummyData';


describe('#logs router', () => {
  const fakeApiClient = (req, res, next) => {
    req.auth0 = {
      connections: {
        getAll: () => Promise.resolve(defaultConnections)
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
        settings: defaultScripts.settings
      }
    }
  };

  const scriptManager = new ScriptManager(storage, 1);

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/connections', fakeApiClient, addUserToReq, connections(scriptManager));

  describe('#Get Connections', () => {
    it('should return filtered connections', (done) => {
      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(defaultConnections.slice(0, 2));
          done();
        });
    });

    it('should return no connections', (done) => {
      storage.data.scripts.settings = defaultScripts.settings_invalid_connection;

      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual([]);
          done();
        });
    });

    it('should return all connections if there is no "connections" field in "settings"', (done) => {
      storage.data.scripts.settings = defaultScripts.settings_no_connections;

      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(defaultConnections);
          done();
        });
    });

    it('should return all connections if setting script not found', (done) => {
      storage.data = {};

      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body).toEqual(defaultConnections);
          done();
        });
    });
  });
});
