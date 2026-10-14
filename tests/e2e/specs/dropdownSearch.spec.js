const { test, expect } = require('../fixtures');
const { userUrl } = require('../helpers/urls');
const { SEEDED_USERS } = require('../helpers/testData');
const { waitForBurstRefill } = require('../helpers/rateLimit');
const { GLN_OPTIONS, GLN_DROPDOWN_SETTINGS_HOOK, HOOK_CACHE_TTL_MS } = require('../helpers/hooks');

const [ { email } ] = SEEDED_USERS;

test.describe('settings hook dropdown search', () => {
  test.beforeEach(async ({ page, daeApi }) => {
    await daeApi.saveScript('settings', GLN_DROPDOWN_SETTINGS_HOOK);
    await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  });

  test.afterEach(async ({ page, daeApi }) => {
    await daeApi.saveScript('settings', '');
    // This hook changes every user form, so it must not still be cached when later tests run
    await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  });

  test('admin can filter custom field dropdown options by typing', async ({ page, managementApi }) => {
    const [ user ] = await managementApi.getUsersByEmail(email);
    const heading = page.getByRole('heading', { name: 'Change Profile' });
    const dialog = page.getByRole('dialog').filter({ has: heading }).last();
    const fieldLabelled = label => dialog.locator('.form-group').filter({ has: page.getByText(label, { exact: true }) });
    const options = page.getByRole('option');

    // react-select's async mode doesn't filter options itself, so this is the regression the doc's hotfix covered
    const expectTypingFiltersOptions = async (field) => {
      const input = field.getByRole('combobox');
      await input.click();
      await expect(options).toHaveText(GLN_OPTIONS);

      await input.fill('9429040039');
      await expect(options).toHaveText([ '9429040039107', '9429040039114', '9429040039121' ]);

      await input.fill('no-such-gln');
      await expect(options).toHaveCount(0);

      await input.fill('40752');
      await expect(options).toHaveText([ '9429040040752' ]);
      await options.click();
    };

    await waitForBurstRefill();
    await page.goto(userUrl(user.user_id));
    await expect(page.getByRole('tabpanel').getByText(email, { exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Actions' }).click();
    await page.getByRole('menuitem', { name: 'Change Profile' }).click();

    const selectComboField = fieldLabelled('GLN');
    await expectTypingFiltersOptions(selectComboField);
    await expect(selectComboField.locator('.react-select__single-value')).toHaveText('9429040040752');

    const multiComboField = fieldLabelled('GLNs');
    await expectTypingFiltersOptions(multiComboField);
    await expect(multiComboField.locator('.react-select__multi-value__label')).toHaveText([ '9429040040752' ]);
  });
});
