import { expect } from 'chai';

import html from '../../../server/routes/html';
import config from '../../../server/lib/config';

const req = {
  headers: {
    host: 'localhost'
  },
  cookies: {},
  url: '/login',
  originalUrl: '/login'
};

describe('# /html', () => {
  process.env.CLIENT_VERSION = '1.0';

  it('should return html with default values', (done) => {
    const route = html();
    process.env.CLIENT_VERSION = '1.0';

    const res = {
      send: (body) => {
        expect(body).to.be.a('string');
        expect(body).to.include('<title></title>');
        expect(body).to.include('<link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png" />');
        expect(body).to.include('<script type="text/javascript" src="//cdn.auth0.com/extensions/develop/auth0-delegated-admin/assets/auth0-delegated-admin.ui.1.0.js"></script>');

        return done();
      },
      cookie: () => null
    };

    route(req, res);
  });

  it('should return html with FAVICON_PATH, CDN_PATH, TITLE and CUSTOM_CSS', (done) => {
    const route = html();

    config.setValue('FAVICON_PATH', 'https://example.com/favicon.png');
    config.setValue('CDN_PATH', '//cdn.example.com');
    config.setValue('TITLE', 'Testing');
    config.setValue('CUSTOM_CSS', '//cdn.example.com/style.css');

    const res = {
      send: (body) => {
        expect(body).to.be.a('string');
        expect(body).to.include('<title>Testing</title>');
        expect(body).to.include('<link rel="shortcut icon" href="https://example.com/favicon.png" />');
        expect(body).to.include('<script type="text/javascript" src="//cdn.example.com/auth0-delegated-admin.ui.1.0.js"></script>');
        expect(body).to.include('<link rel="stylesheet" type="text/css" href="//cdn.example.com/style.css" />');

        return done();
      },
      cookie: () => null
    };

    route(req, res);
  });

  it('should set default (en) locale and redirect to /en/users', (done) => {
    const route = html();

    req.path = '/users';
    req.url = '/users';
    req.originalUrl = '/users';

    const res = {
      redirect: (path) => {
        expect(path).to.equal('/en/users');

        return done();
      },
      cookie: (key, value) => {
        expect(key).to.equal('dae-locale');
        expect(value).to.equal('en');
      }
    };

    route(req, res);
  });

  it('should get cookie locale and redirect to /zz/users', (done) => {
    const route = html();

    req.path = '/users';
    req.url = '/users';
    req.originalUrl = '/users';
    req.cookies = { 'dae-locale': 'zz' };

    const res = {
      redirect: (path) => {
        expect(path).to.equal('/zz/users');

        return done();
      },
      cookie: (key, value) => {
        expect(key).to.equal('dae-locale');
        expect(value).to.equal('zz');
      }
    };

    route(req, res);
  });


  it('should get url locale and set it to cookie', (done) => {
    const route = html();

    req.path = '/xx/users';
    req.url = '/xx/users';
    req.originalUrl = '/xx/users';
    req.cookies = { };

    const res = {
      send: (body) => {
        expect(body).to.be.a('string');
        expect(body).to.include('"LOCALE":"xx"');

        return done();
      },
      cookie: (key, value) => {
        expect(key).to.equal('dae-locale');
        expect(value).to.equal('xx');
      }
    };

    route(req, res);
  });
});
