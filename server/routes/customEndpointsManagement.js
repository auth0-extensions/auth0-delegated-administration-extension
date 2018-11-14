import { Router } from 'express';

export default (scriptManager) => {
  const app = Router();

  app.get('/', (req, res, next) =>
    scriptManager.getAllEndpoints()
      .then(endpoints => res.json(endpoints))
      .catch(err => next(err)));

  app.post('/', (req, res, next) => {
    const { name, handler } = req.body;
    return scriptManager.saveEndpoint(null, name, handler)
      .then(() => res.status(201).send())
      .catch(err => next(err));
  });

  app.put('/:id', (req, res, next) => {
    const { name, handler } = req.body;
    const id = parseInt(req.params.id, 10);
    return scriptManager.saveEndpoint(id, name, handler)
      .then(() => res.status(200).send())
      .catch(err => next(err));
  });

  app.delete('/:id', (req, res, next) =>
    scriptManager.deleteEndpoint(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err)));

  return app;
};
