const roleNames = {
  admin: 'delegated-admin',
  super: 'delegated-super-admin'
};

const checkRole = (data) => {
  let accessLevel = 0;
  if (!data) return accessLevel;

  const parsedData = (Array.isArray(data)) ? data : data.replace(', ', ',', 'g').split(',');

  if (parsedData.indexOf(roleNames.admin) >= 0) accessLevel = 1;
  if (parsedData.indexOf(roleNames.super) >= 0) accessLevel = 2;

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
