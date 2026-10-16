const fs = require('fs');
const { request } = require('@playwright/test');
const { tokenFile } = require('../playwright.config');
const { markManagementApiActivity } = require('./rateLimit');
const { daeApiUrl } = require('./urls');

async function createDaeApiClient(role = 'administrator') {
  const { idToken } = JSON.parse(fs.readFileSync(tokenFile(role), 'utf8'));
  const context = await request.newContext({
    baseURL: daeApiUrl,
    extraHTTPHeaders: { Authorization: `Bearer ${idToken}` }
  });

  // DAE refuses a request for a missing scope before calling the Management API, so only other responses use its rate limit
  const fetchResponse = async (method, url, options) => {
    const response = await context.fetch(url, { method, ...options });
    if (response.status() !== 403) markManagementApiActivity();
    return response;
  };

  const send = async (method, url, options) => {
    const response = await fetchResponse(method, url, options);
    if (!response.ok()) throw new Error(`DAE ${method} ${url} failed: ${response.status()} ${await response.text()}`);
    return response;
  };

  return {
    saveScript: (name, script) => send('POST', `scripts/${name}`, { data: { script } }),
    getUserLogs: async userId => (await send('GET', `users/${encodeURIComponent(userId)}/logs`)).json(),
    request: fetchResponse,
    dispose: () => context.dispose()
  };
}

module.exports = { createDaeApiClient };
