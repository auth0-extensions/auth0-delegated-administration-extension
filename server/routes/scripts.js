import { Router } from 'express';
import { getAllScripts, getScript, setScripts } from '../lib/scripts';

export default () => {
  const api = Router();

  api.get('/', (req, res, next) => getAllScripts(req.storage).then(data => res.json(data)).catch(next));

  api.get('/:name', (req, res, next) => {
    getScript(req.storage, req.params.name)
      .then(script => {
        if (script) {
          const data = script(req.user, req.body);
          res.json(data);
        }
      })
      .catch(err => next(err));
  });

  api.post('/', (req, res, next) => setScripts(req.storage, req.body).then((data) => res.json(data)).catch(next));

  return api;
};
