const { test, expect } = require('../fixtures');
const { userUrl } = require('../helpers/urls');
const { ADMIN_EMAIL } = require('../helpers/testData');
const { waitForBurstRefill } = require('../helpers/rateLimit');

// Every user page load makes several Management API calls, so all the tabs are checked from one load
test('user page shows the user\'s actions, header and tabs', async ({ page, managementApi }) => {
  // The admin is the only user that's sure to have logs, as the setup project logs in as them
  const [ { user_id: userId } ] = await managementApi.getUsersByEmail(ADMIN_EMAIL);
  const tabPanel = page.getByRole('tabpanel');

  await waitForBurstRefill();
  await page.goto(userUrl(userId));

  await test.step('header and actions', async () => {
    await expect(page.getByRole('heading', { name: 'User Details', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toContainText(ADMIN_EMAIL);

    await page.getByRole('button', { name: 'Actions' }).click();
    // Without a settings hook, and for a verified, unblocked user without MFA or a username
    await expect(page.getByRole('menu', { name: 'Actions' }).getByRole('menuitem')).toHaveText([
      'Block User', 'Reset Password', 'Change Email', 'Change Password', 'Delete User'
    ]);
    await page.keyboard.press('Escape');
  });

  await test.step('tabs', async () => {
    await expect(page.getByRole('tab')).toHaveText([ 'User Information', 'Devices', 'Logs', 'Profile' ]);
  });

  await test.step('user information', async () => {
    const infoField = title => tabPanel.locator('.user-info-field').filter({ has: page.getByText(title, { exact: true }) });
    await expect(infoField('Email')).toContainText(ADMIN_EMAIL);
    await expect(infoField('User ID')).toContainText(userId);
    await expect(infoField('Identity')).toContainText(process.env.DAE_CONNECTION);
  });

  await test.step('devices', async () => {
    await page.getByRole('tab', { name: 'Devices' }).click();
    await expect(tabPanel.getByText('This user does not have any registered devices.')).toBeVisible();
  });

  await test.step('logs', async () => {
    await page.getByRole('tab', { name: 'Logs' }).click();
    const table = tabPanel.getByRole('table');
    for (const heading of [ 'Event', 'Description', 'Date', 'Connection', 'Application' ]) {
      await expect(table.getByRole('columnheader', { name: heading, exact: true })).toBeVisible();
    }
    await expect(table.getByRole('row').filter({ has: page.getByRole('cell') }).first()).toBeVisible();
  });

  await test.step('profile', async () => {
    await page.getByRole('tab', { name: 'Profile' }).click();
    const profileJson = JSON.parse(await tabPanel.locator('pre.json-object').textContent());
    expect(profileJson).toMatchObject({ user_id: userId, email: ADMIN_EMAIL });
  });
});
