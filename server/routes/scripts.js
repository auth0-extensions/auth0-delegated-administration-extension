import { Router } from 'express';
import { getScript, setScript } from '../lib/scripts';

export default () => {
  const api = Router();

  api.get('/:name', (req, res, next) => getScript(req.storage, req.params.name, true).then(data => res.json({ script: data })).catch(next));

  api.post('/:name', (req, res, next) => setScript(req.storage, req.body.script, req.params.name).then((data) => res.json(data)).catch(next));

  return api;
};
