import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import connections from '../../../server/routes/connections';
import ScriptManager from '../../../server/lib/scriptmanager';
import { user, defaultConnections, defaultScripts } from '../../utils/dummyData';
import me from "../../../server/routes/me";


describe('#connections router', () => {
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

  function initServer(script) {
    const storage = {
      read: () => Promise.resolve(storage.data),
      data: {
        scripts: {
          settings: script
        }
      }
    };

    const scriptManager = new ScriptManager(storage, 1);

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/connections', fakeApiClient, addUserToReq, connections(scriptManager));
    return app;
  }

  describe('#Get Connections', () => {
    it('should return filtered connections', (done) => {
      const app = initServer(defaultScripts.settings);

      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.length).toEqual(2);
          done();
        });
    });

    it('should return no connections', (done) => {
      const app = initServer(defaultScripts.settings_invalid_connection);

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
      const app = initServer(defaultScripts.settings_no_connections);

      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.length).toEqual(defaultConnections.length);
          done();
        });
    });

    it('should return all connections if setting script not found', (done) => {
      const app = initServer(undefined);

      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.length).toEqual(defaultConnections.length);
          done();
        });
    });

    it('should return connections only with expected fields', (done) => {
      const app = initServer(undefined);

      request(app)
        .get('/connections')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          res.body.forEach(client => {
            expect(Object.keys(client).length).toExist().toBeGreaterThanOrEqualTo(3).toBeLessThanOrEqualTo(4);
            expect(client).toIncludeKeys([ 'id', 'name', 'strategy' ]);

            const options = client.options;
            if (options) {
              expect(Object.keys(options)).toEqual([ 'requires_username' ]);
            }
          });

          done();
        });
    });
  });
});
