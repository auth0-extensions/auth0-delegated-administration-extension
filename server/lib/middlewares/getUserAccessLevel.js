import * as constants from '../../constants';
import _ from 'lodash';

const getUserRoles = (user) => {
  const roles = [
    user.roles,
    user.app_metadata && user.app_metadata.roles,
    user.app_metadata && user.app_metadata.authorization && user.app_metadata.authorization.roles
  ];
  return _(roles)
    .flatten()
    .filter(role => role)
    .uniq()
    .value();
};

const checkRole = (data) => {
  let accessLevel = 0;
  if (!data) return accessLevel;

  const parsedData = (Array.isArray(data)) ? data : data.replace(', ', ',', 'g').split(',');

  if (parsedData.indexOf(constants.USER_ROLE_NAME) >= 0) accessLevel = constants.USER_ACCESS_LEVEL;
  if (parsedData.indexOf(constants.ADMIN_ROLE_NAME) >= 0) accessLevel = constants.ADMIN_ACCESS_LEVEL;

  return accessLevel;
};

module.exports = function getUserAccessLevel(req, res, next) {
  const roles = getUserRoles(req.user);
  const request = req;
  request.user.role = checkRole(roles);
  next();
};
