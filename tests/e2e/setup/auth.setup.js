const fs = require('fs');
const path = require('path');
const { test: setup } = require('@playwright/test');
const { loginViaUniversalLogin } = require('../helpers/login');
const { ROLES, roleUser } = require('../helpers/roles');
const { tokenFile } = require('../playwright.config');

for (const { key } of ROLES) {
  setup(`log in as ${key}`, async ({ page }) => {
    const { email, password } = roleUser(key);
    const idToken = await loginViaUniversalLogin(page, { email, password });
    fs.mkdirSync(path.dirname(tokenFile(key)), { recursive: true });
    fs.writeFileSync(tokenFile(key), JSON.stringify({ idToken }));
  });
}
