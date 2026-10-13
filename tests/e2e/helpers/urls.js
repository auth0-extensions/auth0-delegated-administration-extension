const { DAE_URL, AUTH0_DOMAIN } = process.env;

const daePage = path => new URL(path, DAE_URL).href;

module.exports = {
  daeUrl: DAE_URL,
  daeApiUrl: daePage('api/'),
  usersUrl: daePage('en/users'),
  logsUrl: daePage('en/logs'),
  configurationUrl: daePage('en/configuration'),
  userUrl: userId => daePage(`en/users/${encodeURIComponent(userId)}`),
  universalLoginUrlPattern: new RegExp(`^https://${AUTH0_DOMAIN}/u/login`)
};
