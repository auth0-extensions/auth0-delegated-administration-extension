import express from 'express';
import logger from '../lib/logger';
import * as constants from '../constants';

export default (scriptManager) => {
  const api = express.Router();
  api.get('/', (req, res) => {
    let role = 0;

    if (req.user.scope.indexOf(constants.ADMIN_PERMISSION) >= 0) {
      role = 3;
    } else if (req.user.scope.indexOf(constants.OPERATOR_PERMISSION) >= 0) {
      role = 2;
    } else if (req.user.scope.indexOf(constants.USER_PERMISSION) >= 0) {
      role = 1;
    }

    const me = {
      createMemberships: false,
      memberships: [],
      role
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
      .catch(err => {
        logger.error(err.message);
        res.json(me);
      });
  });

  return api;
};
