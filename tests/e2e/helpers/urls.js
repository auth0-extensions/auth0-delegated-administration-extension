const { DAE_URL, AUTH0_DOMAIN } = process.env;

// Playwright loads specs to list them before global setup sets DAE_URL; workers load them again afterwards
const daePage = path => DAE_URL && new URL(path, DAE_URL).href;

module.exports = {
  daeUrl: DAE_URL,
  daeApiUrl: daePage('api/'),
  usersUrl: daePage('en/users'),
  logsUrl: daePage('en/logs'),
  configurationUrl: daePage('en/configuration'),
  userUrl: userId => daePage(`en/users/${encodeURIComponent(userId)}`),
  universalLoginUrlPattern: new RegExp(`^https://${AUTH0_DOMAIN}/u/login`)
};
