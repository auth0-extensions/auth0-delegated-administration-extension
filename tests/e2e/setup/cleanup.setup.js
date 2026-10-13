const { test: setup } = require('../fixtures');
const { TEST_USER_EMAIL_PREFIX } = require('../helpers/testData');

// Tests delete their own users, but one that fails mid-request can leave a user behind
setup('delete users left over from previous runs', async ({ managementApi }) => {
  const users = await managementApi.searchUsers(`email:${TEST_USER_EMAIL_PREFIX}*`);
  for (const user of users) {
    await managementApi.deleteUser(user.user_id);
  }
});

// Hooks apply to every test, so an interrupted run must not leave one behind.
// Relies on auth.setup.js running first (setup files run alphabetically on a single worker).
setup('clear hooks left over from previous runs', async ({ daeApi }) => {
  for (const name of [ 'filter', 'settings', 'create' ]) {
    await daeApi.saveScript(name, '');
  }
});
