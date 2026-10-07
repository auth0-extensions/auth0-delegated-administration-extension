import { JSDOM } from 'jsdom';
import auth0 from 'auth0-js';
import chai from 'chai';
import chaiMatch from 'chai-match';
import chaiDom from 'chai-dom';

chai.use(chaiMatch);
chai.use(chaiDom);

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop)
    }), {});
  Object.defineProperties(target, props);
}

/* Initialize configuration */
window.config = {
  AUTH0_DOMAIN: 'unitTesting.fakeAuth0.com',
  AUTH0_CLIENT_ID: 'fake-client-id'
};

global.auth0 = auth0;
global.window = window;
global.document = window.document;
global.self = window;
global.IS_REACT_ACT_ENVIRONMENT = true;

copyProps(window, global);

// jsdom exposes XMLHttpRequest on window, and copyProps leaks it onto the global
// scope. axios's default adapter order is ['xhr', 'http', 'fetch'], so a present
// XMLHttpRequest makes it pick the browser XHR transport — even in server-side route
// tests — which bypasses nock (nock only patches Node's http/https). Removing it drops
// axios to the Node http adapter so nock can intercept. Client tests mock via
// axios-mock-adapter (adapter-layer, transport-agnostic), so they don't rely on it.
//
// Note: we deliberately keep global.fetch. The auth0 v4 SDK's ManagementClient falls
// back to `globalThis.fetch.bind(globalThis)` when no fetch is configured, so deleting
// it throws "Cannot read properties of undefined (reading 'bind')" on construction.
// axios never reaches its fetch adapter here anyway — the http adapter precedes it and
// is always available in Node — so keeping fetch doesn't reintroduce the nock bypass.
delete global.XMLHttpRequest;

// Mock components from @a0/auth0-extension-ui to avoid context requirement in tests
import React from 'react';
const mockTabPane = (props) => React.createElement('li', null, props.title);
mockTabPane.displayName = 'TabPane';

const mockSearchBar = (props) => {
  return React.createElement('div', null,
    React.createElement('input', {
      placeholder: props.placeholder,
      type: 'text'
    })
  );
};
mockSearchBar.displayName = 'SearchBar';

// Override the module resolution for @a0/auth0-extension-ui to include our mocks
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === '@a0/auth0-extension-ui') {
    const orig = originalRequire.apply(this, arguments);
    return { ...orig, TabPane: mockTabPane, SearchBar: mockSearchBar };
  }
  return originalRequire.apply(this, arguments);
};
