const { test, expect } = require('../fixtures');
const { usersUrl, configurationUrl } = require('../helpers/urls');
const { openHeaderMenu } = require('../helpers/headerMenu');

const openHeaderMenuItem = async (page, name) => {
  const menu = await openHeaderMenu(page);
  await menu.getByRole('link', { name, exact: true }).click();
};

test('admin can navigate between users and configuration using the header menu', async ({ page }) => {
  await page.goto(usersUrl);

  await openHeaderMenuItem(page, 'Configuration');
  await expect(page).toHaveURL(configurationUrl);
  await expect(page.getByRole('tab', { name: 'Filter Hook' })).toHaveAttribute('aria-selected', 'true');
  const filterHookPanel = page.getByRole('tabpanel', { name: 'Filter Hook' });
  await expect(filterHookPanel.getByRole('textbox')).toBeAttached();
  await expect(filterHookPanel.getByRole('button', { name: 'Save Filter Hook' })).toBeVisible();

  await openHeaderMenuItem(page, 'Users & Logs');
  await expect(page).toHaveURL(usersUrl);
  // The users/logs tabs only expose their selected state through the `active` class
  const usersTab = page.locator('.nav-tabs li', { has: page.getByRole('link', { name: 'Users', exact: true }) });
  await expect(usersTab).toHaveClass('active');
});
