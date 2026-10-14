const { test: setup } = require('../fixtures');
const { TEST_USER_EMAIL_PREFIX } = require('../helpers/testData');

// Tests delete their own users, but one that fails mid-request can leave a user behind
setup('delete users left over from previous runs', async ({ managementApi }) => {
  const users = await managementApi.searchUsers(`email:${TEST_USER_EMAIL_PREFIX}*`);
  for (const user of users) {
    await managementApi.deleteUser(user.user_id);
  }
});

