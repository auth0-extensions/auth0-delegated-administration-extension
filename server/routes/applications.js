import _ from 'lodash';
import { Router } from 'express';

export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    req.auth0.clients.getAll({ fields: 'client_id,name,callbacks,global,app_type' })
      .then(clients => _.chain(clients)
        .filter(client =>
          !client.global &&
          (client.app_type === 'spa' || client.app_type === 'native' || client.app_type === 'regular_web')
        )
        .sortBy(client => client.name.toLowerCase())
        .value()
      )
      .then(clients => res.json(clients))
      .catch(next);
  });

  return api;
}
;
