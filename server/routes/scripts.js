import { Router } from 'express';
import { getAllScripts, setScripts } from '../lib/scripts';

export default () => {
  const api = Router();

  api.get('/', (req, res, next) => getAllScripts(req.storage).then(data => res.json(data)).catch(next));

  api.post('/', (req, res, next) => setScripts(req.storage, req.body).then((data) => res.json(data)).catch(next));

  return api;
};
