// The auth0 v4 SDK resolves management-client calls to a response envelope
// `{ data, headers, status }`, whereas the v3 SDK resolved the payload directly.
// The route handlers were migrated to unwrap `.data`, so the in-memory test
// stubs (which still resolve the bare payload, v3-style) must be wrapped to
// present the same envelope. This keeps the stubs readable (they return plain
// payloads) while matching what the real SDK hands the routes.
//
// Only the resolved value is wrapped; rejections pass through untouched so
// error-path tests still exercise the real rejection.
const wrapResult = value => ({ data: value });

const wrapMethod = fn => (...args) => {
  const result = fn(...args);
  if (result && typeof result.then === 'function') {
    return result.then(wrapResult);
  }
  return Promise.resolve(wrapResult(result));
};

const wrapResource = resource =>
  Object.keys(resource).reduce((acc, key) => {
    const value = resource[key];
    acc[key] = typeof value === 'function' ? wrapMethod(value) : value;
    return acc;
  }, {});

/**
 * Wrap a bare auth0 client stub so every resource method resolves to a v4-style
 * `{ data }` envelope. Shape: `{ users: { getAll, get, ... }, connections: {...} }`.
 */
const wrapV4Client = client =>
  Object.keys(client).reduce((acc, resourceName) => {
    const resource = client[resourceName];
    acc[resourceName] =
      resource && typeof resource === 'object' ? wrapResource(resource) : resource;
    return acc;
  }, {});

export default wrapV4Client;
