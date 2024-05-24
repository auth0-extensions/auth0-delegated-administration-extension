import _ from 'lodash';
import { Router } from 'express';

import multipartRequest from '../lib/multipartRequest';

const CONNECTIONS_LIST_LIMIT = 50;

export default (scriptManager) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    multipartRequest(req.auth0, 'connections', { strategy: 'auth0', fields: 'id,name,strategy,options' }, { perPage: 100, limit: CONNECTIONS_LIST_LIMIT})
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
