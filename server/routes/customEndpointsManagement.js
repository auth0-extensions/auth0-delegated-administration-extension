import { Router } from 'express';

export default (scriptManager) => {
  const app = Router();

  app.get('/', (req, res, next) =>
    scriptManager.getAllEndpoints()
      .then(endpoints => res.json(endpoints))
      .catch(err => next(err)));

  app.post('/', (req, res, next) => {
    const { name, method, handler } = req.body;
    return scriptManager.createEndpoint(name, method, handler)
      .then(() => res.status(201).send())
      .catch(err => next(err));
  });

  app.put('/:oldName', (req, res, next) => {
    const { name, method, handler } = req.body;
    const oldName = req.params.oldName;
    return scriptManager.updateEndpoint(oldName, name, method, handler)
      .then(() => res.status(200).send())
      .catch(err => next(err));
  });

  app.delete('/:name', (req, res, next) => {
    const name = req.params.name;

    return scriptManager.deleteEndpoint(name)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  });

  return app;
};
