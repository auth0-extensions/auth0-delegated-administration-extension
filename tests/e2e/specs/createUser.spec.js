const crypto = require('crypto');
const { test, expect } = require('../fixtures');
const { usersUrl } = require('../helpers/urls');
const { uniqueTestUserEmail } = require('../helpers/testData');

test.describe('create user', () => {
  const email = uniqueTestUserEmail();
  const password = `${crypto.randomBytes(12).toString('base64url')}aA1!`;

  test.afterEach(async ({ managementApi }) => {
    const users = await managementApi.getUsersByEmail(email);
    await Promise.all(users.map(user => managementApi.deleteUser(user.user_id)));
  });

  test('admin can create a user from the users page', async ({ page, managementApi }) => {
    await page.goto(usersUrl);
    await page.getByRole('button', { name: 'Create User' }).click();

    const heading = page.getByRole('heading', { name: 'Create User' });
    // react-bootstrap renders the modal as two nested role="dialog" elements
    const dialog = page.getByRole('dialog').filter({ has: heading }).last();
    await dialog.getByRole('textbox', { name: 'Email (required)' }).fill(email);
    await dialog.getByRole('textbox', { name: 'Password (required)', exact: true }).fill(password);
    await dialog.getByRole('textbox', { name: 'Repeat Password (required)' }).fill(password);
    await dialog.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(heading).toBeHidden();

    const users = await managementApi.getUsersByEmail(email);
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe(email);
  });
});
