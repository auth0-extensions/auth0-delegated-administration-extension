#!/usr/bin/env node
// Usage: node tests/e2e/run.js [--prod | --dev] [--version=x.y.z] [playwright test options and filters]
// Playwright rejects options it doesn't know, so ours are taken out here and passed on to global setup as env vars
const { spawnSync } = require('child_process');

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const playwrightArgs = [];
let env;
let version;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--prod' || arg === '--dev') {
    if (env && env !== arg.slice(2)) fail('Pass only one of --prod and --dev');
    env = arg.slice(2);
  } else if (arg === '--version') {
    version = args[++i];
    if (!version) fail('--version needs a value, e.g. --version=5.0.5');
  } else if (arg.startsWith('--version=')) {
    version = arg.slice('--version='.length);
  } else {
    playwrightArgs.push(arg);
  }
}

if (env) process.env.DAE_CDN_ENV = env;
if (version) process.env.DAE_VERSION = version;

const { status } = spawnSync(process.execPath, [ require.resolve('@playwright/test/cli'), 'test', '-c', __dirname, ...playwrightArgs ], { stdio: 'inherit' });
process.exit(status ?? 1);
