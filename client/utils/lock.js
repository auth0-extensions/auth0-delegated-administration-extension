let gLock = null;

function getLock() {
  if (window.config.AUTH0_CLIENT_ID && !gLock) {
    gLock = new Auth0Lock(window.config.AUTH0_CLIENT_ID, window.config.AUTH0_DOMAIN);
  }

  return gLock;
}

export function getProfile(token, callback) {
  const lock = getLock();
  if (!lock) {
    return;
  }

  lock.$auth0.getProfile(token, callback);
}

export function parseHash(hash) {
  const lock = getLock();
  if (!lock) {
    return null;
  }

  return lock.parseHash(hash);
}

export function show(returnUrl) {
  const lock = getLock();
  if (!lock) {
    throw new Error('Unable to create the Lock.');
  }

  lock.show({
    closable: false,
    responseType: 'token',
    callbackURL: `${window.config.BASE_URL}/login`,
    callbackOnLocationHash: true,
    authParams: {
      state: returnUrl,
      scope: 'openid roles app_metadata authorization'
    }
  });
}
