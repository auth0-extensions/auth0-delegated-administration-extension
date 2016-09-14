import _ from 'lodash';
import { Router } from 'express';

export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    req.auth0.connections.getAll({ fields: 'id,name,strategy,enabled_clients,options' })
      .then(connections => _.chain(connections)
        .sortBy((conn) => conn.name.toLowerCase())
        .value())
      .then(connections => res.json(connections))
      .catch(next);
  });

  return api;
};
