const fs = require('fs');
const base = require('@playwright/test');
const { tokenFile } = require('./playwright.config');
const { createManagementApiClient } = require('./helpers/managementApi');
const { createDaeApiClient } = require('./helpers/daeApi');
const { daeApiUrl } = require('./helpers/urls');
const { placeWindow } = require('./helpers/window');
const { markManagementApiActivity, waitForBurstRefill } = require('./helpers/rateLimit');

const unauthenticatedTest = base.test.extend({
  burstRefill: [ async ({}, use, testInfo) => { // eslint-disable-line no-empty-pattern
    if (testInfo.project.name !== 'setup') await waitForBurstRefill();
    await use();
  }, { auto: true } ],

  // DAE retries some rate limited requests, so a 429 only matters when the test fails. The attached timeline of
  // DAE API calls shows how close each page load came to the Management API burst limit
  page: async ({ page }, use, testInfo) => {
    await placeWindow(page);
    const testStart = Date.now();
    const daeApiRequests = [];
    page.on('response', async (response) => {
      if (!response.url().startsWith(daeApiUrl)) return;
      markManagementApiActivity();
      const request = response.request();
      const startedAt = Math.round(request.timing().startTime - testStart);
      const path = response.url().slice(daeApiUrl.length);
      const body = response.status() === 429 ? await response.text().catch(() => '') : '';
      daeApiRequests.push({ startedAt, line: `+${startedAt}ms ${response.status()} ${request.method()} ${path} ${body}`.trim() });
    });
    await use(page);
    if (testInfo.status !== testInfo.expectedStatus && daeApiRequests.some(({ line }) => / 429 /.test(line))) {
      const timeline = daeApiRequests.sort((a, b) => a.startedAt - b.startedAt).map(({ line }) => line).join('\n');
      // The list reporter truncates inline attachments, so keep the full timeline in a file
      const timelineFile = testInfo.outputPath('dae-api-requests.txt');
      fs.writeFileSync(timelineFile, timeline);
      await testInfo.attach('dae-api-requests', { path: timelineFile, contentType: 'text/plain' });
    }
  }
});

const test = unauthenticatedTest.extend({
  // Which of the installer's users (helpers/roles.js) the page and daeApi act as; set with test.use({ role })
  role: [ 'administrator', { option: true } ],

  // DAE keeps its token in memory and reads `delegated-admin:apiToken` from sessionStorage on page load,
  // so seeding it before every navigation logs the page in without a Universal Login round trip.
  page: async ({ page, role }, use) => {
    const { idToken } = JSON.parse(fs.readFileSync(tokenFile(role), 'utf8'));
    await page.addInitScript((token) => {
      sessionStorage.setItem('delegated-admin:apiToken', token);
    }, idToken);
    await use(page);
  },

  managementApi: [ async ({}, use) => { // eslint-disable-line no-empty-pattern
    const client = await createManagementApiClient();
    await use(client);
    await client.dispose();
  }, { scope: 'worker' } ],

  daeApi: async ({ role }, use) => {
    const client = await createDaeApiClient(role);
    await use(client);
    await client.dispose();
  }
});

module.exports = { test, unauthenticatedTest, expect: base.expect };
