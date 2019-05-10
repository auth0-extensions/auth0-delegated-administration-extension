import _ from 'lodash';
import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import applications from '../../../server/routes/applications';
import { defaultApplications } from '../../utils/dummyData';


describe('#connections router', () => {
  const fakeApiClient = (req, res, next) => {
    req.auth0 = {
      clients: {
        getAll: () => Promise.resolve(defaultApplications)
      }
    };

    next();
  };

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/applications', fakeApiClient, applications());

  describe('#Get Applications', () => {
    it('should return expected clients', (done) => {
      request(app)
        .get('/applications')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.length).toEqual(3);
          done();
        });
    });

    it('should return clients only with expected fields', (done) => {
      request(app)
        .get('/applications')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;

          res.body.forEach(client => {
            expect(Object.keys(client).sort()).toEqual([ 'client_id', 'name' ]);
          });

          done();
        });
    });
  });
});
