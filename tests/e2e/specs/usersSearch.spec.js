const { test, expect } = require('../fixtures');
const { usersUrl } = require('../helpers/urls');
const { SEEDED_USERS } = require('../helpers/testData');

const allEmails = [ process.env.DAE_ADMIN_EMAIL, ...SEEDED_USERS.map(({ email }) => email) ];

test('admin can search users with lucene queries and reset the search', async ({ page }) => {
  await page.goto(usersUrl);

  const searchBar = page.getByRole('textbox', { name: 'Search for users using the Lucene syntax' });
  const resetButton = page.getByRole('button', { name: 'Reset' });
  const userRows = page.getByRole('table').getByRole('row').filter({ has: page.getByRole('cell') });
  const rowFor = email => userRows.filter({ has: page.getByRole('link', { name: email, exact: true }) });

  const expectAllUsersListed = async () => {
    for (const email of allEmails) {
      await expect(rowFor(email)).toBeVisible();
    }
  };

  const expectOnlyUsersListed = async (emails) => {
    await expect(userRows).toHaveCount(emails.length);
    for (const email of emails) {
      await expect(rowFor(email)).toBeVisible();
    }
  };

  const search = async (query) => {
    await searchBar.fill(query);
    await searchBar.press('Enter');
  };

  const reset = async () => {
    await resetButton.click();
    await expect(searchBar).toHaveValue('');
    await expectAllUsersListed();
  };

  await expectAllUsersListed();

  await searchBar.click();
  await search('email:user-a@example.com');
  await expectOnlyUsersListed([ 'user-a@example.com' ]);
  await reset();

  await search('name:user-e');
  await expectOnlyUsersListed([ 'user-e@test.com' ]);
  await reset();

  await search('email:*@test.com');
  await expectOnlyUsersListed([ process.env.DAE_ADMIN_EMAIL, 'user-d@test.com', 'user-e@test.com' ]);
  await reset();
});
