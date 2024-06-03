import _ from 'lodash';
import { Router } from 'express';

import multipartRequest from '../lib/multipartRequest';

// This is the number of connections in a tenant which the DAE can reasonably handle. More than this and it fails to
// finish loading connections and the "create user" button is never shown. If there are more connections than this
// in the tenant, we will return zero connections to the front end, and it will use a free text box for connection name
// in the create user dialogue. 
const CONNECTIONS_FETCH_LIMIT = 200;

export default (scriptManager) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    multipartRequest(
      req.auth0,
      'connections',
      { strategy: 'auth0', fields: 'id,name,strategy,options' },
      { limit: CONNECTIONS_FETCH_LIMIT, perPage: 20 }
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
