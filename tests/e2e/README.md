# DAE e2e tests

Playwright tests that run against DAE installed on a real Auth0 tenant.

## Setup

1. Clone `atko-scratch/dae-functional-tests-scripts` and run `npm install` in its `dae-installer` folder.
2. Copy `.env.example` to `.env` and fill in:
- `AUTH0_DOMAIN`: the test tenant's domain, e.g. `my-tenant.us.auth0.com`. Use a dedicated test tenant: every run reinstalls DAE and changes tenant settings.
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

The installer creates the admin `dae@test.com`, the connection `dae-functional-tests-connection`, and the M2M client `DAE e2e tests (Management API)` the tests use to call the Management API. `.auth/dae-install.json` holds the admin password and the M2M client secret, so don't share it. The setup project enables that connection for DAE's own `auth0-delegated-admin` client (the installer doesn't, and the tenant won't let DAE create users without it) and seeds test users into it. The users list tests search within that connection, so the tenant can have other users and connections.
