import * as constants from '../../constants';


const checkRole = (data) => {
  let accessLevel = 0;
  if (!data) return accessLevel;

  const parsedData = (Array.isArray(data)) ? data : data.replace(', ', ',', 'g').split(',');

  if (parsedData.indexOf(constants.ADMIN_ROLE_NAME) >= 0) accessLevel = constants.ADMIN_ACCESS_LEVEL;
  if (parsedData.indexOf(constants.SUPER_ROLE_NAME) >= 0) accessLevel = constants.SUPER_ACCESS_LEVEL;

  return accessLevel;
};

module.exports = function getUserAccessLevel(req, res, next) {
  const userMeta = req.user.authorization || {};
  const roles = (userMeta.authorization) ? userMeta.authorization.roles || userMeta.roles : userMeta.roles;
  const groups = (userMeta.authorization) ? userMeta.authorization.groups || userMeta.groups : userMeta.groups;
  const request = req;

  request.user.access_level = Math.max(checkRole(roles), checkRole(groups));
  next();
};
