import axios from 'axios';
import jwtDecode from 'jwt-decode';

import * as constants from '../constants';

const auth0 = new Auth0({ // eslint-disable-line no-undef
  domain: window.config.AUTH0_DOMAIN,
  clientID: window.config.AUTH0_CLIENT_ID,
  callbackURL: `${window.config.BASE_URL}/login`,
  callbackOnLocationHash: true
});

export function login(returnUrl) {
  auth0.login({
    state: returnUrl,
    scope: 'openid name email nickname groups roles app_metadata authorization'
  });

  return {
    type: constants.SHOW_LOGIN
  };
}

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

export function logout() {
  return (dispatch) => {
    sessionStorage.removeItem('delegated-admin:apiToken');

    if (window.config.FEDERATED_LOGOUT) {
      window.location.href = `https://${window.config.AUTH0_DOMAIN}/v2/logout?federated&client_id=${window.config.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(window.config.BASE_URL)}`;
    } else {
      window.location.href = `https://${window.config.AUTH0_DOMAIN}/v2/logout?client_id=${window.config.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(window.config.BASE_URL)}`;
    }

    dispatch({
      type: constants.LOGOUT_PENDING
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const token = sessionStorage.getItem('delegated-admin:apiToken');
    if (token || window.location.hash) {
      let apiToken = token;

      const hash = auth0.parseHash(window.location.hash);
      if (hash && hash.idToken) {
        apiToken = hash.idToken;
      }

      if (apiToken) {
        const decodedToken = jwtDecode(apiToken);
        if (isExpired(decodedToken)) {
          return;
        }

        axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

        dispatch({
          type: constants.LOADED_TOKEN,
          payload: {
            token: apiToken
          }
        });

        dispatch({
          type: constants.LOGIN_SUCCESS,
          payload: {
            token: apiToken,
            decodedToken,
            user: decodedToken
          }
        });
      }
    }
  };
}

export function getAccessLevel(onSuccess) {
  return {
    type: constants.FETCH_ACCESS_LEVEL,
    meta: {
      onSuccess
    },
    payload: {
      promise: axios.get('/api/me', {
        responseType: 'json',
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  };
}

export function getAppSettings(onSuccess) {
  return {
    type: constants.FETCH_SETTINGS,
    meta: {
      onSuccess
    },
    payload: {
      promise: axios.get('/api/settings', {
        responseType: 'json'
      })
    }
  };
}
