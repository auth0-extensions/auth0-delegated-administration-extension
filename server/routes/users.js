import { Router } from 'express';

export default () => {
  const api = Router();

  api.get('/', (req, res, next) => {
    const options = {
      sort: 'last_login:-1',
      q: req.query.search,
      per_page: req.query.per_page || 100,
      page: req.query.page || 0,
      include_totals: true,
      fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked',
      search_engine: 'v2'
    };

    req.auth0.users.getAll(options)
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.get('/:id', (req, res, next) => {
    req.auth0.users.get({ id: req.params.id })
      .then(user => res.json({ user }))
      .catch(next);
  });

  api.get('/:id/devices', (req, res, next) => {
    req.auth0.deviceCredentials.getAll({ user_id: req.params.id })
      .then(devices => res.json({ devices }))
      .catch(next);
  });

  api.get('/:id/logs', (req, res, next) => {
    auth0.getUserLogs(req.params.id, {}, req.sub)
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.delete('/:id/multifactor/:provider', (req, res, next) => {
    req.auth0.users.deleteMultifactorProvider({ id: req.params.id, provider: req.params.provider })
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  api.post('/:id/block', (req, res, next) => {
    req.auth0.users.update({ id: req.params.id }, { blocked: true })
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  api.post('/:id/unblock', (req, res, next) => {
    req.auth0.users.update({ id: req.params.id }, { blocked: false })
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  return api;
};
