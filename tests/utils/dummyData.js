import * as constants from '../../server/constants';

export const user = {
  sub: '3',
  app_metadata: { department: 'deptA', roles: constants.USER_ROLE_NAME }
};

export const defaultLogs = [
  { type: 'def', user_id: 1, log_id: 1 },
  { type: 'def', user_id: 5, log_id: 2 },
  { type: 'fapi', user_id: 2, log_id: 3 },
  { type: 'def', user_id: 10, log_id: 4 }
];

export const defaultUsers = [
  { email: 'user1@example.com', user_id: 1, app_metadata: { department: 'deptA' } },
  { email: 'user2@example.com', user_id: 2, app_metadata: { department: 'deptA' } },
  { email: 'user3@example.com', user_id: 3, app_metadata: { department: 'deptA' } },
  { email: 'user4@example.com', user_id: 4, app_metadata: { department: 'deptB' } },
  { email: 'user5@example.com', user_id: 5, app_metadata: { department: 'deptB' } }
];

export const defaultConnections = [
  { name: 'conn-a', strategy: 'auth0' },
  { name: 'conn-b', strategy: 'auth0' },
  { name: 'conn-c', strategy: 'auth0' }
];

export const defaultScripts = {
  access: "function(ctx, callback) { var hasAccess = (ctx.request.user.app_metadata && ctx.payload.user.app_metadata && ctx.payload.user.app_metadata.department && ctx.request.user.app_metadata.department === ctx.payload.user.app_metadata.department); if (!hasAccess) { return callback(new Error('No access.')); } return callback();}",
  filter: "function(ctx, callback) { var department = (ctx.request.user && ctx.request.user.app_metadata.department) ? ctx.request.user.app_metadata.department : null; if (!department || !department.length) { return callback(new Error('The current user is not part of any department.')); } return callback(null, 'app_metadata.delegated-admin.department:\"' + department + '\"');}",
  create: "function(ctx, callback) { if (!ctx.payload.memberships || ctx.payload.memberships.length === 0) { return callback(new Error('The user must be created within a department.')); } var currentDepartment = ctx.request.user.app_metadata.department; if (!currentDepartment || !currentDepartment.length) { return callback(new Error('The current user is not part of any department.')); } if (ctx.payload.memberships[0] !== currentDepartment) { return callback(new Error('You can only create users within your own department.'));}return callback(null, {email: ctx.payload.email, password: ctx.payload.password, connection: ctx.payload.connection, app_metadata: { department: ctx.payload.memberships[0] } });}",
  memberships: "function (ctx, callback) { var parsedData = []; if (ctx.request.user.app_metadata && ctx.request.user.app_metadata && ctx.request.user.app_metadata.department) { var data = ctx.request.user.app_metadata.department; parsedData = (Array.isArray(data)) ? data : data.replace(', ', ',', 'g').split(','); } callback(null, parsedData); }",
  settings: "function (ctx, callback) { var result = { connections: ['conn-a', 'conn-b'], dict: { title: ctx.request.user.email + ' dashboard', memberships: 'Groups' }, css: 'http://localhost:3001/app/default.css' }; callback(null, result);}",
  settings_no_connections: "function (ctx, callback) { var result = { dict: { title: ctx.request.user.email + ' dashboard', memberships: 'Groups' }, css: 'http://localhost:3001/app/default.css' }; callback(null, result);}",
  settings_invalid_connection: "function (ctx, callback) { var result = { connections: ['conn-x'], dict: { title: ctx.request.user.email + ' dashboard', memberships: 'Groups' }, css: 'http://localhost:3001/app/default.css' }; callback(null, result);}"
};

export const defaultConfig = {
  AUTH0_DOMAIN: 'testing.local.com',
  AUTH0_CLIENT_ID: 'AUTH0_CLIENT_ID',
  AUTH0_CLIENT_SECRET: 'AUTH0_CLIENT_SECRET'
};
