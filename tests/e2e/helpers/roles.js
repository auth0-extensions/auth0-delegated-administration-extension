// DAE's roles, from server/constants.js and server/lib/getScopes.js. The installer creates one user per key.
const ROLES = [
  { key: 'norole', scopes: [] },
  { key: 'auditor', name: 'Delegated Admin - Auditor', level: 0, scopes: [ 'read:users' ] },
  { key: 'user', name: 'Delegated Admin - User', level: 1, scopes: [ 'read:users', 'manage:users' ] },
  { key: 'operator', name: 'Delegated Admin - Operator', level: 2, scopes: [ 'read:users', 'manage:users', 'read:logs' ] },
  { key: 'administrator', name: 'Delegated Admin - Administrator', level: 3, scopes: [ 'read:users', 'manage:users', 'read:logs', 'manage:config' ] }
];

// Set by global-setup.js from the install result, so read it when needed rather than at require time
const installerUsers = () => JSON.parse(process.env.DAE_USERS || '[]');

const roleUser = (key) => {
  const user = installerUsers().find(u => u.key === key);
  if (!user) throw new Error(`The install has no ${key} user`);
  return user;
};

const installerUserEmails = () => installerUsers().map(({ email }) => email);

const hasScope = (role, scope) => role.scopes.includes(scope);

module.exports = { ROLES, installerUsers, roleUser, installerUserEmails, hasScope };
