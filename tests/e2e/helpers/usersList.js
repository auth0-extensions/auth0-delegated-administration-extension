const { expect } = require('@playwright/test');
const { usersUrl } = require('./urls');

// The tenant may have other users, so list assertions are scoped to the installer's connection
const testConnectionQuery = () => `identities.connection:"${process.env.DAE_CONNECTION}"`;

function usersList(page) {
  const searchBar = page.getByRole('textbox', { name: 'Search for users using the Lucene syntax' });
  const userRows = page.getByRole('table').getByRole('row').filter({ has: page.getByRole('cell') });
  const rowFor = email => userRows.filter({ has: page.getByRole('link', { name: email, exact: true }) });

  // The users page fetches its list twice on load, so a search made before both have finished can be overwritten
  const waitForInitialLoad = () => page.waitForLoadState('networkidle');

  return {
    open: async () => {
      await page.goto(usersUrl);
      await waitForInitialLoad();
    },
    reload: async () => {
      await page.reload();
      await waitForInitialLoad();
    },
    searchBar,
    userRows,
    search: async (query) => {
      await searchBar.fill(query);
      await searchBar.press('Enter');
    },
    expectOnlyUsersListed: async (emails) => {
      await expect(userRows).toHaveCount(emails.length);
      for (const email of emails) {
        await expect(rowFor(email)).toBeVisible();
      }
    }
  };
}

module.exports = { testConnectionQuery, usersList };
