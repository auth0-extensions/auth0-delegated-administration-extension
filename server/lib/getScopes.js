import _ from 'lodash';

import * as constants from '../constants';


const getUserAccess = (user, type) => {
  const items = [
    user[type],
    user.app_metadata && user.app_metadata[type],
    user.app_metadata && user.app_metadata.authorization && user.app_metadata.authorization[type]
  ];
  return _(items)
    .flatten()
    .filter(item => item)
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

export default function(user) {
  const roles = getUserAccess(user, 'roles');
  const permissions = getUserAccess(user, 'permissions');
  const userRole = checkRole(roles);

  if (userRole >= constants.USER_ACCESS_LEVEL && permissions.indexOf(constants.USER_PERMISSION) < 0) {
    permissions.push(constants.USER_PERMISSION);
  }

  if (userRole === constants.ADMIN_ACCESS_LEVEL && permissions.indexOf(constants.ADMIN_PERMISSION) < 0) {
    permissions.push(constants.ADMIN_PERMISSION);
  }

  return permissions;
};
