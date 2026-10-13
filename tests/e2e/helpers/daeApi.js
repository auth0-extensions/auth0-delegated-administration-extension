const fs = require('fs');
const { request } = require('@playwright/test');
const { ADMIN_TOKEN_FILE } = require('../playwright.config');
const { daeApiUrl } = require('./urls');

async function createDaeApiClient() {
  const { idToken } = JSON.parse(fs.readFileSync(ADMIN_TOKEN_FILE, 'utf8'));
  const context = await request.newContext({
    baseURL: daeApiUrl,
    extraHTTPHeaders: { Authorization: `Bearer ${idToken}` }
  });

  const send = async (method, url, options) => {
    const response = await context.fetch(url, { method, ...options });
    if (!response.ok()) throw new Error(`DAE ${method} ${url} failed: ${response.status()} ${await response.text()}`);
    return response;
  };

  return {
    saveScript: (name, script) => send('POST', `scripts/${name}`, { data: { script } }),
    dispose: () => context.dispose()
  };
}

module.exports = { createDaeApiClient };
