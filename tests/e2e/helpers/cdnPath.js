const { version: localVersion } = require('../../../package.json');

const CDN = 'https://cdn.auth0.com/extensions';
const EXTENSION = 'auth0-delegated-admin';
// Matches resolve_path in tools/cdn.sh
const BUCKETS = { prod: `${CDN}/${EXTENSION}`, dev: `${CDN}/develop/${EXTENSION}` };

// The Dashboard installs the major.minor bundle of the version in the extensions catalog, which each patch release overwrites
async function prodMajorMinor() {
  const response = await fetch(`${CDN}/extensions.json`);
  if (!response.ok) throw new Error(`GET ${CDN}/extensions.json -> ${response.status}`);
  const catalog = await response.json();
  const { version } = (Array.isArray(catalog) ? catalog : catalog.extensions).find(({ name }) => name === EXTENSION);
  return version.split('.').slice(0, 2).join('.');
}

async function assertReachable(url) {
  const response = await fetch(url, { method: 'HEAD' });
  if (!response.ok) throw new Error(`${url} -> ${response.status}; has that build been uploaded to the CDN?`);
}

const isRequested = () => Boolean(process.env.DAE_CDN_PATH || process.env.DAE_CDN_ENV || process.env.DAE_VERSION);

async function resolveCdnPath() {
  const { DAE_CDN_PATH, DAE_CDN_ENV, DAE_VERSION } = process.env;
  if (DAE_CDN_PATH) {
    if (DAE_CDN_ENV || DAE_VERSION) throw new Error('DAE_CDN_PATH can\'t be combined with --prod, --dev or --version');
    await assertReachable(DAE_CDN_PATH);
    return DAE_CDN_PATH;
  }

  const env = DAE_CDN_ENV || 'prod';
  if (!BUCKETS[env]) throw new Error(`Unknown CDN environment "${env}"; use prod or dev`);
  if (DAE_VERSION && !/^\d+\.\d+\.\d+$/.test(DAE_VERSION)) throw new Error(`--version must be a full version like 5.0.5, got "${DAE_VERSION}"`);

  const version = DAE_VERSION || (env === 'prod' ? await prodMajorMinor() : localVersion);
  const bucket = BUCKETS[env];
  const cdnPath = `${bucket}/${EXTENSION}-${version}.js`;
  await assertReachable(cdnPath);
  // The installer only warns when the UI is missing, but DAE's page can't load without it
  if (version.split('.').length === 3) await assertReachable(`${bucket}/assets/${EXTENSION}.ui.${version}.js`);
  return cdnPath;
}

module.exports = { isRequested, resolveCdnPath };
