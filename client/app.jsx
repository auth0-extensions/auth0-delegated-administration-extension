import 'string.prototype.endswith';

import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { loadCredentials } from './actions/auth';
import { router } from './router';
import configureStore from './store/configureStore';
import * as constants from './constants';

// Make axios aware of the base path.
axios.defaults.baseURL = window.config.BASE_URL;

const store = configureStore([], { });

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
const root = createRoot(document.getElementById('app'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
