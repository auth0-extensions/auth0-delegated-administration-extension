// The DAE installer creates this admin. It shares a domain with user-d and user-e, which the filter hook tests rely on
const ADMIN_EMAIL = 'dae@test.com';

const TEST_USER_EMAIL_PREFIX = 'dae-e2e-';

const uniqueTestUserEmail = (domain = 'example.com') => `${TEST_USER_EMAIL_PREFIX}${Date.now()}@${domain}`;

const SEEDED_USERS = [
  'user-a@example.com',
  'user-b@example.com',
  'user-c@example.com',
  'user-d@test.com',
  'user-e@test.com'
].map(email => ({ email, name: email.split('@')[0] }));

module.exports = { ADMIN_EMAIL, TEST_USER_EMAIL_PREFIX, uniqueTestUserEmail, SEEDED_USERS };
