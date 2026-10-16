const crypto = require('crypto');
const { test, expect } = require('../fixtures');
const { userUrl } = require('../helpers/urls');
const { SEEDED_USERS, uniqueTestUserEmail } = require('../helpers/testData');
const { waitForBurstRefill } = require('../helpers/rateLimit');
const {
  ACCESS_DENIED_DELETE_MESSAGE, ACCESS_DENIED_DOMAIN_MESSAGE, SAME_EMAIL_DOMAIN_ACCESS_HOOK, HOOK_CACHE_TTL_MS
} = require('../helpers/hooks');

const otherDomainEmail = SEEDED_USERS.find(({ email }) => email.endsWith('@example.com')).email;

test.describe('access hook', () => {
  // Shares the admin's domain; created per test so a broken hook can't delete a seeded user
  const email = uniqueTestUserEmail('test.com');
  let userId;

  test.beforeEach(async ({ page, daeApi, managementApi }) => {
    await daeApi.saveScript('access', SAME_EMAIL_DOMAIN_ACCESS_HOOK);
    ({ user_id: userId } = await managementApi.createUser({
      email,
      connection: process.env.DAE_CONNECTION,
      password: `${crypto.randomBytes(12).toString('base64url')}aA1!`
    }));
    await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  });

  test.afterEach(async ({ page, daeApi, managementApi }) => {
    await managementApi.deleteUser(userId);
    await daeApi.saveScript('access', '');
    // The users list runs this hook for every user, so it must not still be cached when later tests run
    await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  });

  test('access hook limits which users the admin can view and delete', async ({ page, managementApi }) => {
    const [ otherDomainUser ] = await managementApi.getUsersByEmail(otherDomainEmail);
    const heading = page.getByRole('heading', { name: 'Delete User?' });
    const dialog = page.getByRole('dialog').filter({ has: heading }).last();

    await waitForBurstRefill();
    await page.goto(userUrl(otherDomainUser.user_id));
    await expect(page.getByText(ACCESS_DENIED_DOMAIN_MESSAGE).first()).toBeVisible();
    await expect(page.getByRole('tabpanel').getByText(otherDomainEmail, { exact: true })).toHaveCount(0);

    await waitForBurstRefill();
    await page.goto(userUrl(userId));
    await expect(page.getByRole('tabpanel').getByText(email, { exact: true }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete User' }).click();
    await dialog.getByRole('button', { name: 'Confirm' }).click();
    await expect(dialog.getByText(ACCESS_DENIED_DELETE_MESSAGE)).toBeVisible();
    expect(await managementApi.getUser(userId)).toMatchObject({ email });
  });
});
