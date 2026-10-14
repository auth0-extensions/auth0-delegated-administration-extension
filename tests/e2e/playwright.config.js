const fs = require('fs');
const path = require('path');
const { defineConfig, devices } = require('@playwright/test');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const ADMIN_TOKEN_FILE = path.join(__dirname, '.auth/admin-token.json');
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
    { name: 'setup', testDir: './setup', testMatch: /.*\.setup\.js/ },
    {
      name: 'chromium',
      testDir: './specs',
      dependencies: [ 'setup' ],
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

module.exports.ADMIN_TOKEN_FILE = ADMIN_TOKEN_FILE;
module.exports.DAE_INSTALL_FILE = DAE_INSTALL_FILE;
