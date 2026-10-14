const { test, expect } = require('../fixtures');
const { ADMIN_EMAIL, SEEDED_USERS } = require('../helpers/testData');
const { testConnectionQuery, usersList } = require('../helpers/usersList');

const allEmails = [ ADMIN_EMAIL, ...SEEDED_USERS.map(({ email }) => email) ];

test('admin can search users with lucene queries and reset the search', async ({ page }) => {
  const { open, searchBar, userRows, search, expectOnlyUsersListed } = usersList(page);
  await open();
  const resetButton = page.getByRole('button', { name: 'Reset' });

  const searchAndReset = async (query, expectedEmails) => {
    await search(query);
    await expectOnlyUsersListed(expectedEmails);
    await resetButton.click();
    await expect(searchBar).toHaveValue('');
    await expect.poll(() => userRows.count()).toBeGreaterThan(expectedEmails.length);
  };

  await searchBar.click();
  await search(testConnectionQuery());
  await expectOnlyUsersListed(allEmails);
  await searchAndReset('email:user-a@example.com', [ 'user-a@example.com' ]);
  await searchAndReset('name:user-e', [ 'user-e@test.com' ]);
  await searchAndReset(`email:*@test.com AND ${testConnectionQuery()}`, [ ADMIN_EMAIL, 'user-d@test.com', 'user-e@test.com' ]);
});
