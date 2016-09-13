import { Router } from 'express';

export default (storage, scriptManager) => {
  const api = Router();

  api.get('/:name', (req, res, next) =>
    scriptManager.get(req.params.name)
      .then(data => res.json({ script: data }))
      .catch(next));

  api.post('/:name', (req, res, next) =>
    scriptManager.save(req.params.name, req.body.script)
      .then(() => res.status(200).send())
      .catch(next));

  return api;
};
