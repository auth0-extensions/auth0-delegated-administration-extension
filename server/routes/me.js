import express from 'express';
import logger from '../lib/logger';

export default (scriptManager) => {
  const api = express.Router();
  api.get('/', (req, res) => {
    const me = {
      createMemberships: false,
      memberships: [],
      role: req.user.role || 0
    };

    const membershipContext = {
      request: {
        user: req.user
      },
      payload: {
        user: req.user
      }
    };

    scriptManager.execute('memberships', membershipContext)
      .then(result => {
        if (result && Array.isArray(result)) {
          me.memberships = result;
        } else if (result) {
          me.createMemberships = result.createMemberships || false;
          me.memberships = result.memberships || [];
        }

        return res.json(me);
      })
      .catch((err) => {
        if (err) {
          logger.error(err.message);
        }
        res.json(me);
      });
  });

  return api;
};
