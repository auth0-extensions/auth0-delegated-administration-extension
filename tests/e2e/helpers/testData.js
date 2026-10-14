// The DAE installer creates this admin. It shares a domain with user-d and user-e, which the filter hook tests rely on
const ADMIN_EMAIL = 'dae@test.com';

// The installer names the client DAE's server uses to call the Management API after the extension
const DAE_CLIENT_NAME = 'auth0-delegated-admin';

const TEST_USER_EMAIL_PREFIX = 'dae-e2e-';

const uniqueTestUserEmail = () => `${TEST_USER_EMAIL_PREFIX}${Date.now()}@example.com`;

const SEEDED_USERS = [
  'user-a@example.com',
  'user-b@example.com',
  'user-c@example.com',
  'user-d@test.com',
  'user-e@test.com'
].map(email => ({ email, name: email.split('@')[0] }));

module.exports = { ADMIN_EMAIL, DAE_CLIENT_NAME, TEST_USER_EMAIL_PREFIX, uniqueTestUserEmail, SEEDED_USERS };
