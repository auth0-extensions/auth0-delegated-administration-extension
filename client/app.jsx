import 'babel-polyfill';
import 'string.prototype.endswith';

import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import queryString from 'query-string';

import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import { loadCredentials } from './actions/auth';
import routes from './routes';
import configureStore from './store/configureStore';
import * as constants from './constants';

// Make axios aware of the base path.
axios.defaults.baseURL = window.config.BASE_URL;

// Make history aware of the base path.
const history = useRouterHistory(createHistory)({
  basename: window.config.BASE_PATH || "",

  // history/react-router uses query-string behind the scenes. When query-string parses malformed URLs, 
  // it throws URIError, which crashes the app before any route renders (and the user sees a blank page)
  // This is a workaround to still use query-string for normal parsing so we keep its full behavior
  // while avoiding the crashes caused by malformed URLs.
  parseQueryString: (str) => {
    try {
      return queryString.parse(str);
    } catch (error) {
      if (error instanceof URIError) {
        return {};
      }
      throw error;
    }
  },
});

const store = configureStore([ routerMiddleware(history) ], { });
const reduxHistory = syncHistoryWithStore(history, store);

store.subscribe(() => {
  switch (store.getState().lastAction.type) {
    case constants.FETCH_SETTINGS_FULFILLED: {
      const useAltCss = localStorage.getItem('delegated-admin:use-alt-css') === 'true';
      const data = store.getState().settings.get('record');
      const settings = data.get('settings');
      const dict = settings.get('dict');
      if (dict) {
        const title = dict.get('title');
        if (title && title !== '') {
          document.title = title;
        }
      }
      const css = useAltCss ? settings.get('altcss') : settings.get('css');

      if (css && css.length) {
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.id = 'custom_css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = css;
        link.media = 'all';
        head.appendChild(link);
      }
      break;
    }
    case constants.TOGGLE_STYLE_SETTINGS: {
      const css = store.getState().styleSettings.get('path');
      if (css !== '') {
        const customCss = document.getElementById('custom_css');
        if (customCss) {
          customCss.href = css;
        } else {
          const head = document.getElementsByTagName('head')[0];
          const link = document.createElement('link');
          link.id = 'custom_css';
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = css;
          link.media = 'all';
          head.appendChild(link);
        }
      }
      break;
    }
    default:
      break;
  }
});

store.dispatch(loadCredentials());

// Render application.
ReactDOM.render(
  <Provider store={store}>
    {routes(reduxHistory)}
  </Provider>,
  document.getElementById('app')
);

// Show the developer tools.
if (process.env.NODE_ENV !== 'production') {
  const showDevTools = require('./showDevTools'); // eslint-disable-line global-require

  showDevTools(store);
}
