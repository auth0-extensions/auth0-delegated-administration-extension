import Promise from 'bluebird';
import request from 'superagent';

import config from './config';

function fetchPage(token, connectionId, from) {
  const url = `https://${config('AUTH0_DOMAIN')}/api/v2/connections/${connectionId}/clients`;
  return new Promise((resolve, reject) => {
    const req = request
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    if (from) req.query({ from });

    req.end((err, res) => {
      if (err) return reject(err);
      return resolve(res.body);
    });
  });
}

export default function getConnectionClients(token, connectionId) {
  const allClientIds = [];

  function fetchAllPages(from) {
    return fetchPage(token, connectionId, from)
      .then((body) => {
        const clients = body.clients || [];
        clients.forEach(c => allClientIds.push(c.client_id));

        if (body.next) {
          return fetchAllPages(body.next);
        }

        return { enabled_clients: allClientIds };
      });
  }

  return fetchAllPages(null);
}
