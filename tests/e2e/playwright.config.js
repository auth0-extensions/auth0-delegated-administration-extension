const fs = require('fs');
const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const { windowBounds } = require('./helpers/window');

// A placed window sets the page size, and Playwright doesn't allow a device scale factor without a viewport
const { deviceScaleFactor, ...desktopChrome } = devices['Desktop Chrome']; // eslint-disable-line no-unused-vars
const browserUse = windowBounds ? { ...desktopChrome, viewport: null } : devices['Desktop Chrome'];

const tokenFile = role => path.join(__dirname, `.auth/${role}-token.json`);
const DAE_INSTALL_FILE = path.join(__dirname, '.auth/dae-install.json');

module.exports = defineConfig({
  globalSetup: require.resolve('./global-setup'),
  timeout: 60000,
  expect: { timeout: 15000 },
  retries: process.env.CI ? 1 : 0,
  fullyParallel: false,
  workers: 1,
  outputDir: path.join(__dirname, 'test-results'),
  reporter: [ [ 'list' ], [ 'html', { open: 'never', outputFolder: path.join(__dirname, 'playwright-report') } ] ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'setup', testDir: './setup', testMatch: /.*\.setup\.js/, use: windowBounds ? { viewport: null } : {} },
    {
      name: 'chromium',
      testDir: './specs',
      dependencies: [ 'setup' ],
      use: browserUse
    }
  ]
});

module.exports.tokenFile = tokenFile;
module.exports.DAE_INSTALL_FILE = DAE_INSTALL_FILE;
