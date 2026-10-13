const crypto = require('crypto');
const { test: setup, expect } = require('../fixtures');
const { SEEDED_USERS } = require('../helpers/testData');

const seededUsersQuery = SEEDED_USERS.map(({ email }) => `email:"${email}"`).join(' OR ');

setup('seed users', async ({ managementApi }) => {
  const existingEmails = (await managementApi.searchUsers(seededUsersQuery)).map(({ email }) => email);

  for (const { email, name } of SEEDED_USERS.filter(({ email }) => !existingEmails.includes(email))) {
    try {
      await managementApi.createUser({
        connection: process.env.DAE_CONNECTION,
        email,
        name,
        password: `${crypto.randomBytes(12).toString('base64url')}aA1!`
      });
    } catch (err) {
      // Search lags behind creation, so a user from a recent run may exist but not be searchable yet
      if (err.status !== 409) throw err;
    }
  }

  // The DAE users list is backed by user search
  await expect.poll(async () => (await managementApi.searchUsers(seededUsersQuery)).length, { timeout: 30000, intervals: [ 2000 ] })
    .toBe(SEEDED_USERS.length);
});
