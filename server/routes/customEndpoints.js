import { Router } from 'express';

export default (scriptManager) => {
  const app = Router();
  app.use('/:name', (req, res, next) => {
    console.log(req.params, req.query);

    return scriptManager.callEndpoint(req)
      .then((response) => {
        if (!response) return next();

        return res.status(response.status).send(response.body);
      })
      .catch(err => next(err));
  });

  return app;
};
