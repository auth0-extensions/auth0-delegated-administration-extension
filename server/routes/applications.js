import _ from 'lodash';
import { Router } from 'express';

import multipartRequest from '../lib/multipartRequest';

export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    multipartRequest(req.auth0, 'clients', { is_global: false, fields: 'client_id,name,app_type' })
      .then(clients => _.chain(clients)
        .filter(client => client.app_type === 'spa' || client.app_type === 'native' || client.app_type === 'regular_web')
        .map(({ client_id, name }) => ({ client_id, name }))
        .sortBy(client => client.name.toLowerCase())
        .value()
      )
      .then(clients => res.json(clients))
      .catch(next);
  });

  return api;
};
