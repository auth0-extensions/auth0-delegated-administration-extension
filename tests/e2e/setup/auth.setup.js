const fs = require('fs');
const path = require('path');
const { test: setup } = require('@playwright/test');
const { loginViaUniversalLogin } = require('../helpers/login');
const { ADMIN_TOKEN_FILE } = require('../playwright.config');

setup('log in as admin', async ({ page }) => {
  const idToken = await loginViaUniversalLogin(page, {
    email: process.env.DAE_ADMIN_EMAIL,
    password: process.env.DAE_ADMIN_PASSWORD
  });
  fs.mkdirSync(path.dirname(ADMIN_TOKEN_FILE), { recursive: true });
  fs.writeFileSync(ADMIN_TOKEN_FILE, JSON.stringify({ idToken }));
});
