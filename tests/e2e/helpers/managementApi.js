const { request } = require('@playwright/test');
const { markManagementApiActivity } = require('./rateLimit');

const { AUTH0_DOMAIN, AUTH0_MGMT_CLIENT_ID, AUTH0_MGMT_CLIENT_SECRET } = process.env;

const MAX_ATTEMPTS = 5;

class ManagementApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// x-ratelimit-reset is the epoch second at which the rate limit bucket refills
function retryDelayMs(response, attempt) {
  const reset = Number(response.headers()['x-ratelimit-reset']);
  const untilReset = reset ? reset * 1000 - Date.now() : 0;
  return Math.max(untilReset, 0) + 250 * attempt;
}

async function getManagementApiToken() {
  const context = await request.newContext();
  const response = await context.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
    data: {
      grant_type: 'client_credentials',
      client_id: AUTH0_MGMT_CLIENT_ID,
      client_secret: AUTH0_MGMT_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`
    }
  });
  if (!response.ok()) throw new Error(`Failed to get management API token: ${response.status()} ${await response.text()}`);
  const { access_token: accessToken } = await response.json();
  await context.dispose();
  return accessToken;
}

async function createManagementApiClient() {
  const accessToken = await getManagementApiToken();
  const context = await request.newContext({
    baseURL: `https://${AUTH0_DOMAIN}/api/v2/`,
    extraHTTPHeaders: { Authorization: `Bearer ${accessToken}` }
  });

  const send = async (method, url, options, attempt = 1) => {
    markManagementApiActivity();
    const response = await context.fetch(url, { method, ...options });
    if (response.status() === 429 && attempt < MAX_ATTEMPTS) {
      await sleep(retryDelayMs(response, attempt));
      return send(method, url, options, attempt + 1);
    }
    if (!response.ok()) {
      throw new ManagementApiError(`${method} ${url} failed: ${response.status()} ${await response.text()}`, response.status());
    }
    return response.status() === 204 ? null : response.json();
  };

  return {
    getUsersByEmail: email => send('GET', 'users-by-email', { params: { email } }),
    searchUsers: q => send('GET', 'users', { params: { q, search_engine: 'v3' } }),
    getUser: id => send('GET', `users/${encodeURIComponent(id)}`),
    createUser: user => send('POST', 'users', { data: user }),
    deleteUser: id => send('DELETE', `users/${encodeURIComponent(id)}`),
    getConnectionByName: async name => (await send('GET', 'connections', { params: { name } }))[0],
    getClientByName: async (name) => {
      for (let page = 0; ; page++) {
        const clients = await send('GET', 'clients', { params: { fields: 'client_id,name', per_page: 100, page } });
        const client = clients.find(c => c.name === name);
        if (client || clients.length < 100) return client;
      }
    },
    enableConnectionForClient: (connectionId, clientId) =>
      send('PATCH', `connections/${connectionId}/clients`, { data: [ { client_id: clientId, status: true } ] }),
    dispose: () => context.dispose()
  };
}

module.exports = { createManagementApiClient, ManagementApiError };
