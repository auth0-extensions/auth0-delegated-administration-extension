import _ from 'lodash';
import expect from 'expect';
import Promise from 'bluebird';
import request from 'supertest';
import express from 'express';

import me from '../../../server/routes/me';
import ScriptManager from '../../../server/lib/scriptmanager';
import { user } from '../../utils/dummyData';
import * as constants from '../../../server/constants';


function initServer(script, newUser) {
  const storage = {
    read: () => Promise.resolve(storage.data),
    data: {
      scripts: {
        memberships: script && script.toString()
      }
    }
  };

  const app = express();
  const theUser = newUser || user;
  app.use('/me', (req, res, next) => { req.user = theUser; next(); }, me(new ScriptManager(storage)));
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
        expect(res.body.role).toEqual(1);
        return done();
      });
  });

  it('should return default if script fails', (done) => {
    const app = initServer('(ctx, cb) => cb(new Error("foo"))');
    request(app)
      .get('/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.createMemberships).toEqual(false);
        expect(res.body.memberships).toEqual([]);
        expect(res.body.role).toEqual(1);
        return done();
      });
  });

  it('should support scripts that return an array', (done) => {
    const script = '(ctx, cb) => cb(null, [ "IT", "Finance" ])';

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
        expect(res.body.role).toEqual(1);
        return done();
      });
  });

  it('should support scripts that return an object', (done) => {
    const script = '(ctx, cb) => cb(null, { memberships: [ "IT", "Finance" ] })';

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
        expect(res.body.role).toEqual(1);
        return done();
      });
  });

  it('should support scripts that return an object with createMemberships', (done) => {
    const script = '(ctx, cb) => cb(null, { createMemberships: true, memberships: [ "IT", "Finance" ] })';

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
        expect(res.body.role).toEqual(1);
        return done();
      });
  });

  it('check role 2', (done) => {
    const newUser = _.cloneDeep(user);
    newUser.scope += ` ${constants.OPERATOR_PERMISSION}`;
    const app = initServer(undefined, newUser);
    request(app)
      .get('/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.role).toEqual(2);
        return done();
      });
  });

  it('check role 3', (done) => {
    const newUser = _.cloneDeep(user);
    newUser.scope += ` ${constants.ADMIN_PERMISSION}`;
    const app = initServer(undefined, newUser);
    request(app)
      .get('/me')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.role).toEqual(3);
        return done();
      });
  });
});
