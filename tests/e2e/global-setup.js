const fs = require('fs');
const path = require('path');
const { DAE_INSTALL_FILE } = require('./playwright.config');
const { ADMIN_EMAIL } = require('./helpers/testData');
const { markManagementApiActivity, waitForBurstRefill } = require('./helpers/rateLimit');
const { isRequested, resolveCdnPath } = require('./helpers/cdnPath');

// Workers start after global setup and inherit these
const setEnv = ({ url, user, users, connection, management, cdnPath }) => Object.assign(process.env, {
  ...(cdnPath && { DAE_CDN_PATH: cdnPath }),
  DAE_URL: url,
  DAE_ADMIN_EMAIL: user.email,
  DAE_ADMIN_PASSWORD: user.password,
  DAE_USERS: JSON.stringify(users),
  DAE_CONNECTION: connection,
  AUTH0_MGMT_CLIENT_ID: management.clientId,
  AUTH0_MGMT_CLIENT_SECRET: management.clientSecret
});

// What helpers/managementApi.js needs; the installer grants every Management API scope by default
const MANAGEMENT_SCOPES = [
  'read:users', 'create:users', 'create:users_app_metadata', 'update:users', 'delete:users'
];

module.exports = async () => {
  if (process.env.DAE_E2E_REUSE_INSTALL) {
    if (!fs.existsSync(DAE_INSTALL_FILE)) throw new Error(`DAE_E2E_REUSE_INSTALL is set but ${DAE_INSTALL_FILE} doesn't exist; run once without it to install DAE`);
    const dae = JSON.parse(fs.readFileSync(DAE_INSTALL_FILE, 'utf8'));
    if (!dae.users) throw new Error(`${DAE_INSTALL_FILE} is from an installer without the role users; run without reuse to install them`);
    if (isRequested()) {
      const cdnPath = await resolveCdnPath();
      if (cdnPath !== dae.cdnPath) throw new Error(`Asked for ${cdnPath}, but the last install was ${dae.cdnPath || 'from an unrecorded build'}; run without reuse to install it`);
    }
    console.log(`Reusing DAE installed from ${dae.cdnPath || 'an unrecorded build'}`);
    return setEnv(dae);
  }

  if (!process.env.DAE_INSTALLER_PATH) throw new Error('Set DAE_INSTALLER_PATH in tests/e2e/.env to the DAE installer\'s install.js');
  const { setupDae } = require(process.env.DAE_INSTALLER_PATH);
  const cdnPath = await resolveCdnPath();
  console.log(`Installing DAE from ${cdnPath}`);
  const dae = { cdnPath, ...await setupDae({
    domain: process.env.AUTH0_DOMAIN,
    user: { email: ADMIN_EMAIL },
    managementScopes: MANAGEMENT_SCOPES,
    cdnPath
  }) };

  fs.mkdirSync(path.dirname(DAE_INSTALL_FILE), { recursive: true });
  fs.writeFileSync(DAE_INSTALL_FILE, JSON.stringify(dae, null, 2));
  setEnv(dae);

  markManagementApiActivity();
  await waitForBurstRefill();
};
