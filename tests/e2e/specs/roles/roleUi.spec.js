const { test, expect } = require('../../fixtures');
const { daeApiUrl, logsUrl, configurationUrl, userUrl } = require('../../helpers/urls');
const { ROLES, hasScope } = require('../../helpers/roles');
const { usersList, testConnectionQuery } = require('../../helpers/usersList');
const { openHeaderMenu } = require('../../helpers/headerMenu');
const { waitForBurstRefill } = require('../../helpers/rateLimit');

const SEEDED_EMAIL = 'user-a@example.com';
const can = allowed => (allowed ? 'can' : 'can\'t');

// Each page load makes several Management API calls, so each role checks every page from one load. A control is
// only checked for absence after something shows the page has loaded, or it would pass before the page renders
for (const role of ROLES.filter(({ key }) => key !== 'norole')) {
  test.describe(role.key, () => {
    test.use({ role: role.key });

    test(`${role.key} sees only the controls their role allows`, async ({ page, managementApi }) => {
      const canManageUsers = hasScope(role, 'manage:users');
      const canReadLogs = hasScope(role, 'read:logs');
      const canManageConfig = hasScope(role, 'manage:config');
      const [ { user_id: seededUserId } ] = await managementApi.searchUsers(`email:"${SEEDED_EMAIL}" AND ${testConnectionQuery()}`);
      const rows = page.getByRole('table').getByRole('row').filter({ has: page.getByRole('cell') });

      await test.step('users page', async () => {
        await waitForBurstRefill();
        const { open, userRows } = usersList(page);
        await open();
        await expect(userRows.first()).toBeVisible();

        await test.step(`${can(canManageUsers)} see Create User`, async () => {
          await expect.soft(page.getByRole('button', { name: 'Create User' })).toHaveCount(canManageUsers ? 1 : 0);
        });
        await test.step(`${can(canReadLogs)} see the Logs tab`, async () => {
          await expect.soft(page.getByRole('link', { name: 'Logs', exact: true })).toHaveCount(canReadLogs ? 1 : 0);
        });
      });

      await test.step(`${can(canManageConfig)} see Configuration and Users & Logs in the header menu`, async () => {
        const menu = await openHeaderMenu(page);
        await expect(menu.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
        await expect.soft(menu.getByRole('link', { name: 'Configuration', exact: true })).toHaveCount(canManageConfig ? 1 : 0);
        await expect.soft(menu.getByRole('link', { name: 'Users & Logs', exact: true })).toHaveCount(canManageConfig ? 1 : 0);
        await page.keyboard.press('Escape');
      });

      await test.step('user page', async () => {
        await waitForBurstRefill();
        // The controls only depend on the role from GET /api/me. The user's own data can hit the rate limit on dev
        // tenants, as the page fetches it twice
        const meLoaded = page.waitForResponse(response => response.url() === `${daeApiUrl}me`);
        await page.goto(userUrl(seededUserId));
        await meLoaded;
        await expect(page.getByRole('tab', { name: 'User Information' })).toBeVisible();

        await test.step(`${can(canManageUsers)} see Actions`, async () => {
          const actions = page.getByRole('button', { name: 'Actions' });
          await expect.soft(actions).toHaveCount(canManageUsers ? 1 : 0);
          if (!canManageUsers) return;
          await actions.click();
          const menu = page.getByRole('menu', { name: 'Actions' });
          await expect.soft(menu.getByRole('menuitem', { name: 'Block User' })).toBeVisible();
          await expect.soft(menu.getByRole('menuitem', { name: 'Delete User' })).toBeVisible();
          await page.keyboard.press('Escape');
        });
        // The user page's logs only need read:users
        await test.step('can see the user\'s Logs tab', async () => {
          await expect.soft(page.getByRole('tab', { name: 'Logs' })).toBeVisible();
        });
      });

      await test.step(`${can(canReadLogs)} see the logs page`, async () => {
        await waitForBurstRefill();
        await page.goto(logsUrl);
        if (canReadLogs) {
          await expect.soft(rows.first()).toBeVisible();
        } else {
          await expect.soft(page.getByText('Missing scope read:logs').first()).toBeVisible();
          await expect.soft(rows).toHaveCount(0);
        }
      });

      await test.step(`${can(canManageConfig)} see the configuration page`, async () => {
        await waitForBurstRefill();
        await page.goto(configurationUrl);
        if (canManageConfig) {
          const filterHookPanel = page.getByRole('tabpanel', { name: 'Filter Hook' });
          await expect.soft(filterHookPanel.getByRole('button', { name: 'Save Filter Hook' })).toBeVisible();
        } else {
          await expect.soft(page.getByText('Missing scope manage:config').first()).toBeVisible();
        }
      });
    });
  });
}

test.describe('norole', () => {
  test.use({ role: 'norole' });

  // Every API call is refused for read:users. When GET /api/me fails, the client falls back to role 2
  test('norole can\'t see any users', async ({ page }) => {
    const { open, userRows } = usersList(page);
    await open();
    await expect(page.getByText('An error occurred while loading the users list: Cannot perform action. Missing scope read:users')).toBeVisible();
    await expect(page.getByText('No users found by given parameters.')).toBeVisible();
    await expect(userRows).toHaveCount(0);
    await expect.soft(page.getByRole('button', { name: 'Create User' })).toBeVisible();
    await expect.soft(page.getByRole('link', { name: 'Logs', exact: true })).toBeVisible();
  });
});
