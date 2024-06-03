import _ from 'lodash';
import { Router } from 'express';

import multipartRequest from '../lib/multipartRequest';

// the limit on the frontend is 20000 so we need to fetch at least as many connections as that to 
// check if that limit is reached. If we fetch less than the frontend limit, it would always show the
// drop down select box which would be broken for tenants with more connections than the limit. 
// const CONNECTIONS_FETCH_LIMIT = 20000;
const CONNECTIONS_FETCH_LIMIT = 20;

export default (scriptManager) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    multipartRequest(
      req.auth0,
      'connections',
      { strategy: 'auth0', fields: 'id,name,strategy,options' },
      { limit: CONNECTIONS_FETCH_LIMIT, perPage: 100 }
    )
      .then((connections) => {
        global.connections = connections.map(conn => ({ name: conn.name, id: conn.id }));
        const settingsContext = {
          request: {
            user: req.user
          },
          locale: req.headers['dae-locale']
        };

        return scriptManager.execute('settings', settingsContext)
          .then((settings) => {
            let result = _.chain(connections)
              .sortBy(conn => conn.name.toLowerCase())
              .value();

            if (settings && settings.connections && Array.isArray(settings.connections) && settings.connections.length) {
              result = result.filter(conn => (settings.connections.indexOf(conn.name) >= 0));
            }

            return result;
          });
      })
      // need to filter out everything except:
      //  id, name, options.requires_username
      .then(connections => connections.map(conn => ({
        id: conn.id,
        name: conn.name,
        strategy: conn.strategy,
        options: conn.options ? { requires_username: conn.options.requires_username } : null
      })))
      .then(connections => res.json(connections))
      .catch(next);
  });

  return api;
};
