const TEST_USER_EMAIL_PREFIX = 'dae-e2e-';

const uniqueTestUserEmail = () => `${TEST_USER_EMAIL_PREFIX}${Date.now()}@example.com`;

const SEEDED_USERS = [
  'user-a@example.com',
  'user-b@example.com',
  'user-c@example.com',
  'user-d@test.com',
  'user-e@test.com'
].map(email => ({ email, name: email.split('@')[0] }));

module.exports = { TEST_USER_EMAIL_PREFIX, uniqueTestUserEmail, SEEDED_USERS };
