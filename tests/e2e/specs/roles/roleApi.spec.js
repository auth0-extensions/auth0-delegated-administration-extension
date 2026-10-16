const crypto = require('crypto');
const { test, expect } = require('../../fixtures');
const { createDaeApiClient } = require('../../helpers/daeApi');
const { ROLES, roleUser, hasScope } = require('../../helpers/roles');
const { uniqueTestUserEmail } = require('../../helpers/testData');
const { waitForBurstRefill } = require('../../helpers/rateLimit');

// The UI hides what a role can't do, but the API is what enforces it, so every endpoint is called with each role's token
const password = `${crypto.randomBytes(12).toString('base64url')}aA1!`;
const createTarget = managementApi => managementApi.createUser({
  email: uniqueTestUserEmail(),
  password,
  connection: process.env.DAE_CONNECTION,
  email_verified: true
});
const userExists = (managementApi, id) =>
  managementApi.getUser(id).then(() => true, (err) => {
    if (err.status === 404) return false;
    throw err;
  });

let adminId;
let logId;
let admin;

test.beforeAll(async ({ managementApi }) => {
  const [ adminUser ] = (await managementApi.getUsersByEmail(roleUser('administrator').email))
    .filter(user => user.identities.some(({ connection }) => connection === process.env.DAE_CONNECTION));
  adminId = adminUser.user_id;
  admin = await createDaeApiClient('administrator');
  // The setup project logs every role in, so the admin always has a login log
  const [ log ] = await admin.getUserLogs(adminId);
  logId = log.log_id || log._id;
});

test.afterAll(async () => {
  await admin.dispose();
});

const id = userId => encodeURIComponent(userId);

// Run in order: the target user is blocked by the unblock step and deleted by the last one
const ENDPOINTS = [
  { method: 'GET', path: 'me', run: async ({ send, ok, role }) => {
    const response = await send('me');
    if (ok(response)) expect.soft((await response.json()).role).toBe(role.level);
  } },
  { method: 'GET', path: 'users', run: async ({ send, ok, targetId }) => {
    const response = await send(`users?search=${encodeURIComponent(`user_id:"${targetId}"`)}`);
    if (ok(response)) expect.soft((await response.json()).users.map(({ user_id: userId }) => userId)).toEqual([ targetId ]);
  } },
  { method: 'GET', path: 'users/:id', run: async ({ send, ok, targetId }) => {
    const response = await send(`users/${id(targetId)}`);
    if (ok(response)) expect.soft((await response.json()).user.user_id).toBe(targetId);
  } },
  { method: 'GET', path: 'users/:id/logs', run: async ({ send, ok }) => {
    const response = await send(`users/${id(adminId)}/logs`);
    if (ok(response)) expect.soft((await response.json()).length).toBeGreaterThan(0);
  } },
  { method: 'GET', path: 'users/:id/devices', run: async ({ send, ok, targetId }) => {
    const response = await send(`users/${id(targetId)}/devices`);
    if (ok(response)) expect.soft(await response.json()).toEqual({ devices: [] });
  } },
  { method: 'GET', path: 'logs', routeScope: 'read:logs', run: async ({ send, ok }) => {
    const response = await send('logs');
    if (ok(response)) expect.soft((await response.json()).length).toBeGreaterThan(0);
  } },
  // Without read:logs, DAE runs the access hook on the log's user instead
  { method: 'GET', path: 'logs/:id', run: async ({ send, ok }) => {
    const response = await send(`logs/${encodeURIComponent(logId)}`);
    if (ok(response)) expect.soft((await response.json()).log.user_id).toBe(adminId);
  } },
  { method: 'GET', path: 'scripts/filter', routeScope: 'manage:config', run: async ({ send }) => {
    await send('scripts/filter');
  } },
  { method: 'POST', path: 'scripts/filter', routeScope: 'manage:config', run: async ({ send, allowed }) => {
    const before = await (await admin.request('GET', 'scripts/filter')).json();
    await send('scripts/filter', { script: '' });
    if (!allowed) expect.soft(await (await admin.request('GET', 'scripts/filter')).json()).toEqual(before);
  } },
  { method: 'POST', path: 'users', run: async ({ send, allowed, managementApi }) => {
    const email = uniqueTestUserEmail();
    await send('users', { email, password, repeatPassword: password, connection: process.env.DAE_CONNECTION });
    const created = await managementApi.getUsersByEmail(email);
    await Promise.all(created.map(user => managementApi.deleteUser(user.user_id)));
    expect.soft(created).toHaveLength(allowed ? 1 : 0);
  } },
  { method: 'PUT', path: 'users/:id/block', run: async ({ send, allowed, managementApi, targetId }) => {
    await managementApi.updateUser(targetId, { blocked: false });
    await send(`users/${id(targetId)}/block`);
    expect.soft(Boolean((await managementApi.getUser(targetId)).blocked)).toBe(allowed);
  } },
  { method: 'PUT', path: 'users/:id/unblock', run: async ({ send, allowed, managementApi, targetId }) => {
    await managementApi.updateUser(targetId, { blocked: true });
    await send(`users/${id(targetId)}/unblock`);
    expect.soft(Boolean((await managementApi.getUser(targetId)).blocked)).toBe(!allowed);
  } },
  { method: 'DELETE', path: 'users/:id', run: async ({ send, allowed, managementApi, targetId }) => {
    await send(`users/${id(targetId)}`);
    expect.soft(await userExists(managementApi, targetId)).toBe(!allowed);
  } }
];

for (const role of ROLES) {
  test.describe(role.key, () => {
    test.use({ role: role.key });
    let targetId;

    test.afterEach(async ({ managementApi }) => {
      if (targetId && await userExists(managementApi, targetId)) await managementApi.deleteUser(targetId);
    });

    test(`${role.key} can only call the API endpoints their role allows`, async ({ daeApi, managementApi }) => {
      test.slow();
      ({ user_id: targetId } = await createTarget(managementApi));

      for (const { method, path, routeScope, run } of ENDPOINTS) {
        // Every GET needs read:users and anything else manage:users, checked before the route's own scope
        const scopes = [ method === 'GET' ? 'read:users' : 'manage:users', ...(routeScope ? [ routeScope ] : []) ];
        const missingScope = scopes.find(scope => !hasScope(role, scope));
        const allowed = !missingScope;

        await test.step(`${allowed ? 'can' : 'can\'t'} ${method} /api/${path}`, async () => {
          await waitForBurstRefill();
          const send = async (url, data) => {
            const response = await daeApi.request(method, url, data && { data });
            if (allowed) {
              expect.soft(response.ok(), `${response.status()} ${await response.text()}`).toBe(true);
            } else {
              expect.soft(response.status()).toBe(403);
              if (response.status() === 403) {
                expect.soft(await response.json()).toMatchObject({ message: `Cannot perform action. Missing scope ${missingScope}` });
              }
            }
            return response;
          };
          // Only check the body of a response that was meant to succeed and did
          const ok = response => allowed && response.ok();
          await run({ send, ok, allowed, role, managementApi, targetId });
        });
      }
    });
  });
}
