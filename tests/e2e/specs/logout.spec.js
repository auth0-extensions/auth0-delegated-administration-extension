// The shared admin token isn't injected because logout needs a real Auth0 session
const { unauthenticatedTest: test, expect } = require('../fixtures');
const { loginViaUniversalLogin } = require('../helpers/login');
const { openHeaderMenu } = require('../helpers/headerMenu');
const { daeUrl, universalLoginUrlPattern } = require('../helpers/urls');

const expectOnLoginPage = async (page) => {
  await expect(page).toHaveURL(universalLoginUrlPattern);
  const { searchParams } = new URL(page.url());
  expect(searchParams.get('state')).toBeTruthy();
  expect(searchParams.get('ui_locales')).toBe('en');
  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
};

test('admin can log out and must log in again to return', async ({ page }) => {
  await loginViaUniversalLogin(page, {
    email: process.env.DAE_ADMIN_EMAIL,
    password: process.env.DAE_ADMIN_PASSWORD
  });

  const menu = await openHeaderMenu(page);
  await menu.getByRole('menuitem', { name: 'Logout', exact: true }).click();
  await expectOnLoginPage(page);

  // A surviving DAE token or Auth0 session would land us back on the users page instead
  await page.goto(daeUrl);
  await expectOnLoginPage(page);
});
