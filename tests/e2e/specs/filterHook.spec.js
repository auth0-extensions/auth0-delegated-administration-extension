const { test, expect } = require('../fixtures');
const { configurationUrl } = require('../helpers/urls');
const { SEEDED_USERS } = require('../helpers/testData');
const { installerUserEmails } = require('../helpers/roles');
const { SAME_EMAIL_DOMAIN_FILTER_HOOK, HOOK_CACHE_TTL_MS } = require('../helpers/hooks');
const { testConnectionQuery, usersList } = require('../helpers/usersList');

const allEmails = [ ...installerUserEmails(), ...SEEDED_USERS.map(({ email }) => email) ];
const sameDomainEmails = allEmails.filter(email => email.endsWith('@test.com'));

// CodeMirror auto-indents typed text and only renders visible lines, so read its value directly
const editorValue = tabPanel => tabPanel.locator('.CodeMirror').evaluate(el => el.CodeMirror.getValue());

const isSaveFilterHookResponse = response =>
  response.url().endsWith('/api/scripts/filter') && response.request().method() === 'POST';

test.describe('filter hook', () => {
  test.beforeEach(async ({ daeApi }) => {
    await daeApi.saveScript('filter', '');
  });

  test.afterEach(async ({ daeApi, page }, testInfo) => {
    await daeApi.saveScript('filter', '');
    // A failed test may have left a filter cached on the server, which would leak into later tests
    if (testInfo.status !== testInfo.expectedStatus) await page.waitForTimeout(HOOK_CACHE_TTL_MS);
  });

  test('admin can save and clear the filter hook', async ({ page }) => {
    await page.goto(configurationUrl);
    const filterHookTab = page.getByRole('tab', { name: 'Filter Hook' });
    const filterHookPanel = page.getByRole('tabpanel', { name: 'Filter Hook' });
    const saveButton = filterHookPanel.getByRole('button', { name: 'Save Filter Hook' });
    // Tab titles are italic while their hook is empty
    const emptyHookTitle = filterHookTab.locator('i');

    await expect.poll(() => editorValue(filterHookPanel)).toBe('');
    await expect(emptyHookTitle).toBeVisible();

    await filterHookPanel.locator('.CodeMirror').click();
    await page.keyboard.insertText(SAME_EMAIL_DOMAIN_FILTER_HOOK);
    await Promise.all([ page.waitForResponse(isSaveFilterHookResponse), saveButton.click() ]);

    await page.reload();
    await expect.poll(() => editorValue(filterHookPanel)).toBe(SAME_EMAIL_DOMAIN_FILTER_HOOK);
    await expect(emptyHookTitle).toBeHidden();

    await filterHookPanel.locator('.CodeMirror').click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Backspace');
    await Promise.all([ page.waitForResponse(isSaveFilterHookResponse), saveButton.click() ]);

    await page.reload();
    await expect.poll(() => editorValue(filterHookPanel)).toBe('');
    await expect(emptyHookTitle).toBeVisible();
  });

  test('filter hook restricts the users list to the admin\'s email domain', async ({ page, daeApi }) => {
    const { open, reload, userRows, search, expectOnlyUsersListed } = usersList(page);

    // Waiting out the hook cache, rather than polling until one instance updates, also stops a stale
    // filter leaking into later tests from another server instance
    const saveFilterHookAndWaitForCache = async (script) => {
      await daeApi.saveScript('filter', script);
      await page.waitForTimeout(HOOK_CACHE_TTL_MS);
    };

    await saveFilterHookAndWaitForCache(SAME_EMAIL_DOMAIN_FILTER_HOOK);
    await open();
    // DAE ANDs the filter hook's query onto the search
    await search(testConnectionQuery());
    await expectOnlyUsersListed(sameDomainEmails);
    await expect(userRows.filter({ hasText: '@example.com' })).toHaveCount(0);

    await saveFilterHookAndWaitForCache('');
    await reload();
    await search(testConnectionQuery());
    await expectOnlyUsersListed(allEmails);
  });
});
