# DAE e2e tests

Playwright tests that run against DAE installed on a real Auth0 tenant.

## Setup

1. Clone `atko-scratch/dae-functional-tests-scripts` and run `npm install` in its `dae-installer` folder.
2. Copy `.env.example` to `.env` and fill in:
- `AUTH0_DOMAIN`: the test tenant's domain, e.g. `my-tenant.us.auth0.com`. Use a dedicated test tenant: every run reinstalls DAE and changes tenant settings.
- `AUTH0_TENANT_TIER` (optional): `enterprise` if the tenant has the enterprise Management API rate limits (a burst of 50, refilled at 16 requests/second), or `free` (the default) for free and dev tenants (a burst of 10, refilled at 2 requests/second). Tests wait 1s or 5s respectively after Management API activity before loading pages, so a tenant set to `enterprise` without those limits will hit 429s.
- `DAE_E2E_WINDOW` (optional): `left,top,width,height` in screen points for every browser window, including the installer's Dashboard window, e.g. to keep them in one place for screen recordings with `--headed`. The page fills the window rather than using the 1280x720 viewport. The top left of the main display is `0,0`; displays above it have negative tops.
- `DAE_INSTALLER_PATH`: the absolute path to the installer's `install.js`.
- `DAE_CDN_PATH` (optional): the full URL of a DAE build to install, overriding the version flags below.

## Running

- `npm run test:e2e` installs DAE on the tenant with the installer, then runs the tests against it. The installer opens a Chrome window: log in to the Dashboard there the first time (or when the session expires). Later runs reuse that session.
- `npm run test:e2e:reuse` skips the install and reuses the last one, from `.auth/dae-install.json`. Use it while working on a spec. If a run was interrupted mid-test and left a hook behind, run `npm run test:e2e` to reinstall.
- `npm run test:e2e:headed` runs with a visible browser.
- To choose which build of DAE to install, pass these after `--`, e.g. `npm run test:e2e -- --dev --version=5.0.5`:
- no flags, or `--prod` on its own: the production build the Dashboard installs, i.e. the major.minor bundle (e.g. `auth0-delegated-admin-5.0.js`) of the version in `https://cdn.auth0.com/extensions/extensions.json`
- `--dev`: the build of this repo's `package.json` version in the develop bucket, `https://cdn.auth0.com/extensions/develop/auth0-delegated-admin`
- `--version=x.y.z` (or `--version x.y.z`): that exact version, from the production bucket unless `--dev` is also passed
- The build must already be on the CDN; the run stops before installing if its bundle or UI assets aren't there. `.auth/dae-install.json` records which build was installed, and `test:e2e:reuse` stops if the flags ask for a different one.
- To run a single spec, pass its path after `--`, e.g. `npm run test:e2e:reuse -- specs/userPage`. The setup project still runs first. Add `--headed` to watch it, or `-g "<test name>"` to run only the tests whose names match.

The installer creates the connection `dae-functional-tests-connection`, enables it on DAE's own `auth0-delegated-admin` client, and creates the M2M client `DAE e2e tests (Management API)` the tests use to call the Management API. It also creates the 4 DAE roles and a user in that connection for each, all with the same password:
- `dae-auditor@test.com`: Delegated Admin - Auditor
- `dae-user@test.com`: Delegated Admin - User
- `dae-operator@test.com`: Delegated Admin - Operator
- `dae@test.com`: Delegated Admin - Administrator
- `dae-norole@test.com`: no DAE role

`.auth/dae-install.json` holds that password and the M2M client secret, so don't share it. The setup project logs in as each user, saving `.auth/<role>-token.json`, and seeds test users into the connection. The users list tests search within that connection, so the tenant can have other users and connections.

## Roles

- Specs run as the administrator unless they set `test.use({ role: '<role>' })`, where `<role>` is a key from `helpers/roles.js` (`norole`, `auditor`, `user`, `operator` or `administrator`).
- `specs/roles/roleApi.spec.js` has one test per role, with a step per DAE API endpoint. Each step calls the endpoint with the role's token, and checks it's allowed or refused with the scope the role is missing.
- `specs/roles/roleUi.spec.js` checks which controls and pages each role sees.
- `specs/roles/roleWrites.spec.js` runs user actions as the User role, and opens a log as the Operator.
- Every role test name starts with the role, so `npm run test:e2e:reuse -- specs/roles -g "user (can|sees)"` runs just one role. Plain `-g "user"` would also match tests like `operator can GET /api/users`.
- `roleApi.spec.js` and `roleUi.spec.js` name each check as a step, such as `can't GET /api/logs` or `users page › can't see Create User`. To print the steps under each test, run `PLAYWRIGHT_LIST_PRINT_STEPS=1 npm run test:e2e:reuse -- specs/roles/roleApi specs/roles/roleUi --reporter=list`, adding `-g "<role> (can|sees)"` for one role.
- To step through the tests with a screenshot and the DOM at each step, run `npm run test:e2e:reuse -- specs/roles --ui`.
