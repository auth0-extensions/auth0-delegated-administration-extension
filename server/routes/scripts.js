import { Router } from 'express';
import { ValidationError } from 'auth0-extension-tools';

import * as constants from '../constants';
import config from '../lib/config';

export default (storage, scriptManager) => {
  const api = Router();
  api.get('/:name', (req, res, next) => {
    if (constants.VALID_SCRIPTS.indexOf(req.params.name) < 0) {
      return next(new ValidationError(`Invalid script name: ${req.params.name}`));
    }

    return scriptManager.get(req.params.name)
      .then(data => res.json({ script: data, token: config('EXTEND_TOKEN') }))
      .catch(next);
  });

  api.post('/:name', (req, res, next) => {
    if (constants.VALID_SCRIPTS.indexOf(req.params.name) < 0) {
      return next(new ValidationError(`Invalid script name: ${req.params.name}`));
    }

    return scriptManager.save(req.params.name, req.body.script)
      .then(() => res.status(200).send())
      .catch(next);
  });

  return api;
};
