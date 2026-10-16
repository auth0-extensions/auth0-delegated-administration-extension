const { expect } = require('@playwright/test');

const { daeUrl, usersUrl, universalLoginUrlPattern } = require('./urls');

// Resolves with the id token Auth0 returns in the URL hash of DAE's /login callback
function captureIdToken(page) {
  return new Promise((resolve) => {
    const onNavigated = (frame) => {
      if (frame !== page.mainFrame()) return;
      const idToken = new URLSearchParams(new URL(frame.url()).hash.slice(1)).get('id_token');
      if (idToken) {
        page.off('framenavigated', onNavigated);
        resolve(idToken);
      }
    };
    page.on('framenavigated', onNavigated);
  });
}

async function loginViaUniversalLogin(page, { email, password }) {
  const idToken = captureIdToken(page);
  await page.goto(daeUrl);

  await expect(page).toHaveURL(universalLoginUrlPattern);
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await expect(page).toHaveURL(usersUrl);
  await expect(page.getByRole('heading', { name: 'Users', level: 1 })).toBeVisible();
  return idToken;
}

module.exports = { loginViaUniversalLogin };
