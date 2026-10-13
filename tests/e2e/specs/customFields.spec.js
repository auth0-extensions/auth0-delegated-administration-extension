const crypto = require('crypto');
const { test, expect } = require('../fixtures');
const { userUrl } = require('../helpers/urls');
const { uniqueTestUserEmail } = require('../helpers/testData');
const { waitForBurstRefill } = require('../helpers/rateLimit');
const { CUSTOM_FIELDS_SETTINGS_HOOK, CUSTOM_FIELDS_WRITE_HOOK, HOOK_CACHE_TTL_MS } = require('../helpers/hooks');

test.describe('custom fields', () => {
  const email = uniqueTestUserEmail();
  let userId;

  test.beforeEach(async ({ page, daeApi, managementApi }) => {
    await daeApi.saveScript('settings', CUSTOM_FIELDS_SETTINGS_HOOK);
    await daeApi.saveScript('create', CUSTOM_FIELDS_WRITE_HOOK);
    ({ user_id: userId } = await managementApi.createUser({
      email,
      connection: process.env.DAE_CONNECTION,
      password: `${crypto.randomBytes(12).toString('base64url')}aA1!`,
      app_metadata: { input_multi_combo: [ 'AppOne', 'AppTwo' ], input_select_combo: 'AppOne' }
    }));
    await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  });

  test.afterEach(async ({ page, daeApi, managementApi }) => {
    await managementApi.deleteUser(userId);
    await daeApi.saveScript('settings', '');
    await daeApi.saveScript('create', '');
    // These hooks change every user form, so they must not still be cached when later tests run
    await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  });

  test('admin can edit settings hook custom fields from the change profile dialog', async ({ page, managementApi }) => {
    const heading = page.getByRole('heading', { name: 'Change Profile' });
    // react-bootstrap renders the modal as two nested role="dialog" elements
    const dialog = page.getByRole('dialog').filter({ has: heading }).last();
    // The field labels aren't associated with their react-select inputs, so scope by form group instead
    const multiComboField = dialog.locator('.form-group').filter({ hasText: 'InputMultiCombo Field' });
    const selectComboField = dialog.locator('.form-group').filter({ hasText: 'InputSelectCombo Field' });
    const multiComboValues = multiComboField.locator('.react-select__multi-value__label');
    const selectComboValue = selectComboField.locator('.react-select__single-value');

    // The dialog's initial values come from the loaded user, so opening it too early leaves the fields empty
    // Each user page load makes several Management API calls, enough to exhaust the burst after a save
    const openUserPage = async () => {
      await waitForBurstRefill();
      await page.goto(userUrl(userId));
      await expect(page.getByRole('tabpanel').getByText(email, { exact: true }).first()).toBeVisible();
    };

    const openChangeProfile = async () => {
      await page.getByRole('button', { name: 'Actions' }).click();
      await page.getByRole('menuitem', { name: 'Change Profile' }).click();
    };

    const saveChangeProfile = async () => {
      await Promise.all([
        page.waitForResponse(response => response.url().endsWith(`/api/users/${encodeURIComponent(userId)}`) && response.request().method() === 'PATCH' && response.ok()),
        dialog.getByRole('button', { name: 'Update', exact: true }).click()
      ]);
      await expect(heading).toBeHidden();
    };

    const selectOption = async (field, option) => {
      await field.getByRole('combobox').click();
      await page.getByRole('option', { name: option, exact: true }).click();
    };

    await openUserPage();
    await openChangeProfile();
    await expect(multiComboValues).toHaveText([ 'AppOne', 'AppTwo' ]);
    await expect(selectComboValue).toHaveText('AppOne');

    await saveChangeProfile();
    expect((await managementApi.getUser(userId)).app_metadata).toEqual({
      input_multi_combo: [ 'AppOne', 'AppTwo' ],
      input_select_combo: 'AppOne'
    });

    await openChangeProfile();
    await selectOption(multiComboField, 'AppThree');
    await selectOption(selectComboField, 'AppTwo');
    await expect(multiComboValues).toHaveText([ 'AppOne', 'AppTwo', 'AppThree' ]);
    await expect(selectComboValue).toHaveText('AppTwo');

    // The changed form sends { label, value } objects, which the write hook flattens back to plain values
    await saveChangeProfile();
    expect((await managementApi.getUser(userId)).app_metadata).toEqual({
      input_multi_combo: [ 'AppOne', 'AppTwo', 'AppThree' ],
      input_select_combo: 'AppTwo'
    });

    await openUserPage();
    await openChangeProfile();
    await expect(multiComboValues).toHaveText([ 'AppOne', 'AppTwo', 'AppThree' ]);
    await expect(selectComboValue).toHaveText('AppTwo');
  });
});
