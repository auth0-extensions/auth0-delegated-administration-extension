import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { push, routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import { loadCredentials } from './actions/auth';
import routes from './routes';
import configureStore from './store/configureStore';
import * as constants from './constants';

// Make axios aware of the base path.
axios.defaults.baseURL = window.config.BASE_URL;

// Make history aware of the base path.
const history = useRouterHistory(createHistory)({
  basename: window.config.BASE_PATH || ''
});

const store = configureStore([ routerMiddleware(history) ], { });
const reduxHistory = syncHistoryWithStore(history, store);

store.subscribe(() => {
  switch (store.getState().lastAction.type) {
    case constants.FETCH_SETTINGS_PENDING: {
      document.getElementById('app').style.display = 'none';
      break;
    }
    case constants.FETCH_SETTINGS_REJECTED: {
      document.getElementById('app').style.display = 'block';
      break;
    }
    case constants.FETCH_SETTINGS_FULFILLED: {
      const data = store.getState().settings.get('record');
      const settings = data.get('settings');
      const dict = settings.get('dict');
      if (dict) {
        const title = dict.get('title');
        if (title && title !== '') {
          document.title = title;
        }
      }
      const css = settings.get('css');

      if (css !== '') {
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.id = 'custom_css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = css;
        link.media = 'all';
        head.appendChild(link);
      }
      document.getElementById('app').style.display = 'block';
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

store.dispatch(push('/users'));

// Show the developer tools.
if (process.env.NODE_ENV !== 'production') {
  const showDevTools = require('./showDevTools'); // eslint-disable-line global-require
  showDevTools(store);
}
