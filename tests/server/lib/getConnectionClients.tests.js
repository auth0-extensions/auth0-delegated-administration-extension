import nock from 'nock';
import { expect } from 'chai';
import { describe, it, afterEach } from 'mocha';

import config from '../../../server/lib/config';
import getConnectionClients from '../../../server/lib/getConnectionClients';
import { defaultConfig } from '../../utils/dummyData';

describe('#getConnectionClients', () => {
  config.setProvider((key) => defaultConfig[key], null);

  const domain = `https://${defaultConfig.AUTH0_DOMAIN}`;
  const connectionId = 'con_abc123';
  const token = 'test-token';

  afterEach(() => nock.cleanAll());

  it('should return enabled_clients as an array of client IDs', (done) => {
    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .reply(200, {
        clients: [{ client_id: 'client1' }, { client_id: 'client2' }]
      });

    getConnectionClients(token, connectionId)
      .then((result) => {
        expect(result).to.deep.equal({ enabled_clients: ['client1', 'client2'] });
        done();
      })
      .catch(done);
  });

  it('should return empty enabled_clients when no clients exist', (done) => {
    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .reply(200, { clients: [] });

    getConnectionClients(token, connectionId)
      .then((result) => {
        expect(result).to.deep.equal({ enabled_clients: [] });
        done();
      })
      .catch(done);
  });

  it('should handle missing clients property in response', (done) => {
    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .reply(200, {});

    getConnectionClients(token, connectionId)
      .then((result) => {
        expect(result).to.deep.equal({ enabled_clients: [] });
        done();
      })
      .catch(done);
  });

  it('should paginate through all pages using the next cursor', (done) => {
    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .reply(200, {
        clients: [{ client_id: 'client1' }, { client_id: 'client2' }],
        next: 'cursor1'
      });

    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .query({ from: 'cursor1' })
      .reply(200, {
        clients: [{ client_id: 'client3' }],
        next: 'cursor2'
      });

    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .query({ from: 'cursor2' })
      .reply(200, {
        clients: [{ client_id: 'client4' }]
      });

    getConnectionClients(token, connectionId)
      .then((result) => {
        expect(result).to.deep.equal({
          enabled_clients: ['client1', 'client2', 'client3', 'client4']
        });
        done();
      })
      .catch(done);
  });

  it('should reject on error response', (done) => {
    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .reply(403, { statusCode: 403, error: 'Forbidden', message: 'Insufficient scope' });

    getConnectionClients(token, connectionId)
      .then(() => done(new Error('should have rejected')))
      .catch((err) => {
        expect(err.status).to.equal(403);
        done();
      });
  });

  it('should reject on error during pagination', (done) => {
    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .reply(200, {
        clients: [{ client_id: 'client1' }],
        next: 'cursor1'
      });

    nock(domain)
      .get(`/api/v2/connections/${connectionId}/clients`)
      .query({ from: 'cursor1' })
      .reply(500, { statusCode: 500, error: 'Internal Server Error' });

    getConnectionClients(token, connectionId)
      .then(() => done(new Error('should have rejected')))
      .catch((err) => {
        expect(err.status).to.equal(500);
        done();
      });
  });
});
