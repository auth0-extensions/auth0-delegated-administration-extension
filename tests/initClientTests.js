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
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
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
Module.prototype.require = function(id) {
  if (id === '@a0/auth0-extension-ui') {
    const orig = originalRequire.apply(this, arguments);
    return { ...orig, TabPane: mockTabPane, SearchBar: mockSearchBar };
  }
  return originalRequire.apply(this, arguments);
};
