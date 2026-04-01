import { expect } from 'chai';
import { describe, it } from 'mocha';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import scripts from '../../../server/routes/scripts';
import ScriptManager from '../../../server/lib/scriptmanager';
import { errorHandler } from '../../../server/lib/middlewares';
import { defaultScripts } from '../../utils/dummyData';

describe('#scripts router', () => {
  const storage = {
    read: () => Promise.resolve({ scripts: defaultScripts }),
    write: (data) => {
      storage.data = data;
      return Promise.resolve();
    },
    data: { scripts: defaultScripts }
  };

  const scriptManager = new ScriptManager(storage);

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/scripts', scripts(storage, scriptManager));
  app.use(errorHandler());

  describe('valid scripts', () => {
    it('should return a script on GET /scripts/filter', (done) => {
      request(app)
        .get('/scripts/filter')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('script');
          done();
        });
    });

    it('should save a script on POST /scripts/filter', (done) => {
      request(app)
        .post('/scripts/filter')
        .send({ script: 'function(ctx, cb) { cb(); }' })
        .expect(200)
        .end((err) => done(err));
    });
  });

  describe('customDomain script access', () => {
    it('should return a script on GET /scripts/customDomain', (done) => {
      request(app)
        .get('/scripts/customDomain')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('script');
          done();
        });
    });

    it('should save a script on POST /scripts/customDomain', (done) => {
      request(app)
        .post('/scripts/customDomain')
        .send({ script: 'function(ctx, cb) { cb(); }' })
        .expect(200)
        .end((err) => done(err));
    });
  });
});
