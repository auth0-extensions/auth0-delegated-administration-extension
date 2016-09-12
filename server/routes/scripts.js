import { Router } from 'express';
import { getScript, setScript, getAllScripts, setScripts } from '../lib/scripts';

export default () => {
  const api = Router();

  api.get('/', (req, res, next) => getAllScripts(req.storage).then(data => res.json(data)).catch(next));

  api.post('/', (req, res, next) => setScripts(req.storage, req.body).then((data) => res.json(data)).catch(next));

  api.get('/:name', (req, res, next) => getScript(req.storage, req.params.name).then(data => res.json(data || '')).catch(next));

  api.post('/:name', (req, res, next) => setScript(req.storage, req.body.script, req.params.name).then((data) => res.json(data)).catch(next));

  return api;
};
