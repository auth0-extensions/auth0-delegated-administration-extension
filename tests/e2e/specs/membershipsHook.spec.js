const crypto = require('crypto');
const { test, expect } = require('../fixtures');
const { usersUrl, userUrl } = require('../helpers/urls');
const { uniqueTestUserEmail } = require('../helpers/testData');
const { waitForBurstRefill } = require('../helpers/rateLimit');
const { MEMBERSHIPS, MEMBERSHIPS_HOOK, SINGLE_MEMBERSHIP_HOOK, HOOK_CACHE_TTL_MS } = require('../helpers/hooks');

test.describe('memberships hook', () => {
  let email;
  const password = `${crypto.randomBytes(12).toString('base64url')}aA1!`;

  const saveMembershipsHookAndWaitForCache = async (page, daeApi, script) => {
    await daeApi.saveScript('memberships', script);
    await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  };

  const openCreateUserDialog = async (page) => {
    await page.goto(usersUrl);
    await page.getByRole('button', { name: 'Create User' }).click();
    const heading = page.getByRole('heading', { name: 'Create User' });
    // react-bootstrap renders the modal as two nested role="dialog" elements
    const dialog = page.getByRole('dialog').filter({ has: heading }).last();
    await dialog.getByRole('textbox', { name: 'Email (required)' }).fill(email);
    await dialog.getByRole('textbox', { name: 'Password (required)', exact: true }).fill(password);
    await dialog.getByRole('textbox', { name: 'Repeat Password (required)' }).fill(password);
    const connectionField = dialog.getByRole('combobox', { name: 'Connection (required)' });
    if (await connectionField.count()) await connectionField.selectOption(process.env.DAE_CONNECTION);
    return {
      // The field label isn't associated with its react-select input, so scope by form group instead
      membershipsField: dialog.locator('.form-group').filter({ hasText: 'Memberships' }),
      create: async () => {
        await dialog.getByRole('button', { name: 'Create', exact: true }).click();
        await expect(heading).toBeHidden();
      }
    };
  };

  test.beforeEach(() => {
    email = uniqueTestUserEmail();
  });

  test.afterEach(async ({ page, daeApi, managementApi }) => {
    const users = await managementApi.getUsersByEmail(email);
    await Promise.all(users.map(user => managementApi.deleteUser(user.user_id)));
    await daeApi.saveScript('memberships', '');
    await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  });

  test('admin can pick memberships from the hook when creating a user', async ({ page, daeApi, managementApi }) => {
    await saveMembershipsHookAndWaitForCache(page, daeApi, MEMBERSHIPS_HOOK);
    const { membershipsField, create } = await openCreateUserDialog(page);

    await membershipsField.getByRole('combobox').click();
    // DAE also lists a blank option, from adding the form's empty memberships value to the hook's list
    await expect(membershipsField.getByRole('option').filter({ hasText: /\S/ })).toHaveText(MEMBERSHIPS);
    await membershipsField.getByRole('option', { name: 'HR', exact: true }).click();
    await membershipsField.getByRole('combobox').click();
    await membershipsField.getByRole('option', { name: 'IT', exact: true }).click();
    await create();

    const [ user ] = await managementApi.getUsersByEmail(email);
    // Without a create hook DAE saves the select's { value, label } options as they are. Customers rely on this, so it's kept
    expect(user.app_metadata).toEqual({ memberships: [ { value: 'HR', label: 'HR' }, { value: 'IT', label: 'IT' } ] });

    // The user page shows what the hook returns for that user
    await waitForBurstRefill();
    await page.goto(userUrl(user.user_id));
    await expect(page.getByRole('tabpanel').getByText(email, { exact: true }).first()).toBeVisible();
    await expect(page.locator('.user-info')).toContainText(MEMBERSHIPS.join(', '));
  });

  test('a single membership is hidden and given to every new user', async ({ page, daeApi, managementApi }) => {
    await saveMembershipsHookAndWaitForCache(page, daeApi, SINGLE_MEMBERSHIP_HOOK);
    const { membershipsField, create } = await openCreateUserDialog(page);

    await expect(membershipsField).toHaveCount(0);
    await create();

    const [ user ] = await managementApi.getUsersByEmail(email);
    expect(user.app_metadata).toEqual({ memberships: [ 'IT' ] });
  });
});
