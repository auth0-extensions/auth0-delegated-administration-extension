const { test, expect } = require('../fixtures');
const { usersUrl, logsUrl } = require('../helpers/urls');

test('admin can navigate to the logs page and see recent logs', async ({ page }) => {
  await page.goto(usersUrl);
  await page.getByRole('link', { name: 'Logs', exact: true }).click();

  await expect(page).toHaveURL(logsUrl);
  await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Load More' })).toBeVisible();

  const table = page.getByRole('table');
  for (const heading of [ 'Event', 'Description', 'Date', 'Connection', 'Application' ]) {
    await expect(table.getByRole('columnheader', { name: heading, exact: true })).toBeVisible();
  }
  await expect(table.getByRole('row').filter({ has: page.getByRole('cell') }).first()).toBeVisible();
});
