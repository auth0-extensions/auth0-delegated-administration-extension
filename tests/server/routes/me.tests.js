import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';

import me from '../../../server/routes/me';
import ScriptManager from '../../../server/lib/scriptmanager';
import { user } from '../../utils/dummyData';

function initServer(script) {
  const storage = {
    read: () => Promise.resolve(storage.data),
    data: {
      scripts: {
        memberships: script && script.toString()
      }
    }
  };

  const app = express();
  app.use('/me', (req, res, next) => { req.user = user; next(); }, me(new ScriptManager(storage)));
  return app;
}

describe('# /me', () => {
  it('should return default is script is not defined', (done) => {
    const app = initServer();
    request(app)
      .get('/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.createMemberships).toEqual(false);
        expect(res.body.memberships).toEqual([]);
        expect(res.body.role).toEqual(0);
        return done();
      });
  });

  it('should return default if script fails', (done) => {
    const script = (ctx, cb) => cb(new Error('foo'));

    const app = initServer(script);
    request(app)
      .get('/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.createMemberships).toEqual(false);
        expect(res.body.memberships).toEqual([]);
        expect(res.body.role).toEqual(0);
        return done();
      });
  });

  it('should support scripts that return an array', (done) => {
    const script = (ctx, cb) => cb(null, [ 'IT', 'Finance' ]);

    const app = initServer(script);
    request(app)
      .get('/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.createMemberships).toEqual(false);
        expect(res.body.memberships.length).toEqual(2);
        expect(res.body.memberships[1]).toEqual('Finance');
        expect(res.body.role).toEqual(0);
        return done();
      });
  });

  it('should support scripts that return an object', (done) => {
    const script = (ctx, cb) => cb(null, { memberships: [ 'IT', 'Finance' ] });

    const app = initServer(script);
    request(app)
      .get('/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.createMemberships).toEqual(false);
        expect(res.body.memberships.length).toEqual(2);
        expect(res.body.memberships[1]).toEqual('Finance');
        expect(res.body.role).toEqual(0);
        return done();
      });
  });

  it('should support scripts that return an object with createMemberships', (done) => {
    const script = (ctx, cb) => cb(null, { createMemberships: true, memberships: [ 'IT', 'Finance' ] });

    const app = initServer(script);
    request(app)
      .get('/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.createMemberships).toEqual(true);
        expect(res.body.memberships.length).toEqual(2);
        expect(res.body.memberships[1]).toEqual('Finance');
        expect(res.body.role).toEqual(0);
        return done();
      });
  });
});
