const crypto = require('crypto');
const { test, expect } = require('../../fixtures');
const { usersUrl, userUrl, logsUrl } = require('../../helpers/urls');
const { uniqueTestUserEmail } = require('../../helpers/testData');
const { waitForBurstRefill } = require('../../helpers/rateLimit');

// The other specs only run these flows as the admin, so these show the scopes work below admin level
test.describe('user', () => {
  test.use({ role: 'user' });
  const email = uniqueTestUserEmail();
  const password = `${crypto.randomBytes(12).toString('base64url')}aA1!`;

  test.afterEach(async ({ managementApi }) => {
    const users = await managementApi.getUsersByEmail(email);
    await Promise.all(users.map(user => managementApi.deleteUser(user.user_id)));
  });

  test('user can create, block and unblock a user', async ({ page, managementApi }) => {
    test.slow();
    const dialogWithHeading = name => page.getByRole('dialog').filter({ has: page.getByRole('heading', { name }) }).last();

    await test.step('create', async () => {
      await page.goto(usersUrl);
      await page.getByRole('button', { name: 'Create User' }).click();
      const dialog = dialogWithHeading('Create User');
      await dialog.getByRole('textbox', { name: 'Email (required)' }).fill(email);
      await dialog.getByRole('textbox', { name: 'Password (required)', exact: true }).fill(password);
      await dialog.getByRole('textbox', { name: 'Repeat Password (required)' }).fill(password);
      const connectionField = dialog.getByRole('combobox', { name: 'Connection (required)' });
      if (await connectionField.count()) await connectionField.selectOption(process.env.DAE_CONNECTION);
      await dialog.getByRole('button', { name: 'Create', exact: true }).click();
      await expect(dialog).toBeHidden();
      await expect.poll(async () => (await managementApi.getUsersByEmail(email)).length).toBe(1);
    });

    const [ { user_id: userId } ] = await managementApi.getUsersByEmail(email);
    const blocked = async () => Boolean((await managementApi.getUser(userId)).blocked);
    const runAction = async (action) => {
      await page.getByRole('button', { name: 'Actions' }).click();
      await page.getByRole('menuitem', { name: action }).click();
      await dialogWithHeading(`${action}?`).getByRole('button', { name: 'Confirm' }).click();
    };

    // The user page fetches the user twice, which can hit the rate limit on dev tenants and leave it unloaded
    const openUserPage = () => expect(async () => {
      await waitForBurstRefill();
      await page.goto(userUrl(userId));
      await expect(page.getByRole('tabpanel').getByText(email, { exact: true }).first()).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 45000 });

    await openUserPage();

    await test.step('block', async () => {
      await runAction('Block User');
      await expect.poll(blocked).toBe(true);
    });

    await test.step('unblock', async () => {
      await openUserPage();
      await runAction('Unblock User');
      await expect.poll(blocked).toBe(false);
    });
  });
});

test.describe('operator', () => {
  test.use({ role: 'operator' });

  test('operator can open a log from the logs page', async ({ page }) => {
    await page.goto(logsUrl);
    const firstRow = page.getByRole('table').getByRole('row').filter({ has: page.getByRole('cell') }).first();
    // The Event cell opens the log
    await firstRow.getByRole('cell').nth(1).click();
    await expect(page.getByRole('heading', { name: /^Log - / })).toBeVisible();
  });
});
