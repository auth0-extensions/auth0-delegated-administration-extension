import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { push } from 'react-router-redux';

import * as constants from '../constants';

const issuer = window.config.AUTH0_TOKEN_ISSUER || `https://${window.config.AUTH0_DOMAIN}/`;

const webAuth = new auth0.WebAuth({ // eslint-disable-line no-undef
  domain: window.config.AUTH0_DOMAIN,
  clientID: window.config.AUTH0_CLIENT_ID,
  overrides: {
    __tenant: issuer.substr(8).split('.')[0],
    __token_issuer: issuer
  }
});

export function login(returnUrl, locale) {
  sessionStorage.setItem('delegated-admin:returnTo', returnUrl || '/users');

  webAuth.authorize({
    responseType: 'id_token',
    redirectUri: `${window.config.BASE_URL}/${locale}/login`,
    scope: 'openid roles',
    ui_locales: locale
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

export function logout(logoutUrl) {
  return (dispatch) => {
    sessionStorage.clear();
    localStorage.clear();

    if (logoutUrl) {
      window.location.href = logoutUrl;
    } else if (window.config.FEDERATED_LOGOUT) {
      window.location.href = `https://${window.config.AUTH0_DOMAIN}/v2/logout?federated&client_id=${window.config.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(window.config.BASE_URL)}`;
    } else {
      window.location.href = `https://${window.config.AUTH0_DOMAIN}/v2/logout?client_id=${window.config.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(window.config.BASE_URL)}`;
    }

    dispatch({
      type: constants.LOGOUT_PENDING
    });
  };
}

const processTokens = (dispatch, apiToken, returnTo) => {
  const decodedToken = jwtDecode(apiToken);
  if (isExpired(decodedToken)) {
    return;
  }

  axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;
  axios.defaults.headers.common['dae-locale'] = localStorage.getItem('dae:locale') || 'en';

  sessionStorage.setItem('delegated-admin:apiToken', apiToken);

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
      user: decodedToken,
      returnTo
    }
  });

  if (returnTo) {
    dispatch(push(returnTo));
  }
};

export function loadCredentials() {
  return (dispatch) => {
    const token = sessionStorage.getItem('delegated-admin:apiToken');
    if (token || window.location.hash) {

      if (window.location.hash) {
        dispatch({
          type: constants.LOGIN_PENDING
        });

        return webAuth.parseHash({
          hash: window.location.hash
        }, (err, hash) => {
          if (err || !hash || !hash.idToken) {
            /* Must have had hash, but didn't get an idToken in the hash */
            console.error('login error: ', err);
            return dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: err && err.error ? `${err.error}: ${err.errorDescription}` : 'UnknownError: Unknown Error'
              }
            });
          }

          const returnTo = sessionStorage.getItem('delegated-admin:returnTo');
          sessionStorage.removeItem('delegated-admin:returnTo');
          return processTokens(dispatch, hash.idToken, returnTo);
        });
      }

      /* There was no hash, so use the token from storage */
      return processTokens(dispatch, token);
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
  return (dispatch) => dispatch({
    type: constants.FETCH_SETTINGS,
    meta: {
      onSuccess: (response) => {
        return dispatch(getLanguageDictionary(response, onSuccess));
      }
    },
    payload: {
      promise: axios('/api/settings', {
        responseType: 'json'
      })
    }
  });
}

export function toggleStyleSettings() {
  return (dispatch, getState) => {
    let settings = getState().settings.get('record').toJS();
    settings = settings.settings || settings || {};
    const useAlt = localStorage.getItem('delegated-admin:use-alt-css') === 'true';
    const path = useAlt ? settings.css : settings.altcss;
    localStorage.setItem('delegated-admin:use-alt-css', (!useAlt).toString());
    dispatch({
      type: constants.TOGGLE_STYLE_SETTINGS,
      payload: {
        useAlt: !useAlt,
        path
      }
    });
  };
}

export function getStyleSettings() {
  return (dispatch, getState) => {
    let settings = getState().settings.get('record').toJS();
    settings = settings.settings || settings || {};
    const useAlt = localStorage.getItem('delegated-admin:use-alt-css') === 'true';
    const path = !useAlt ? settings.css : settings.altcss;

    dispatch({
      type: constants.GET_STYLE_SETTINGS,
      payload: {
        useAlt,
        path
      }
    });
  };
}

function getLanguageDictionary(response, onSuccess) {
  const settings = _.get(response, 'data.settings', {});
  let promise = Promise.resolve({ data: {} });
  if (settings.languageDictionary) {
    if (_.isObject(settings.languageDictionary)) {
      promise = Promise.resolve({ data: settings.languageDictionary });
    } else if (_.isString(settings.languageDictionary) && settings.languageDictionary.startsWith('http')) {
      // Setting Authorization to None because we don't want to ship the token to some undeclared endpoint,
      // especially if not enforcing https
      const oldAuth = axios.defaults.headers.common['Authorization'];
      const oldLocale = axios.defaults.headers.common['dae-locale'];
      delete axios.defaults.headers.common['Authorization']; // and create your own headers
      delete axios.defaults.headers.common['dae-locale']; // and create your own headers

      promise = axios.get(settings.languageDictionary, { responseType: 'json' })
        .then((response) => {
          if (response.data) return response;
          return Promise.reject(new Error(`Language Dictionary endpoint: ${settings.languageDictionary} returned no data`));
        });

      // TODO: Race condition?  I hope not!
      axios.defaults.headers.common['Authorization'] = oldAuth;
      axios.defaults.headers.common['dae-locale'] = oldLocale;
    } // ignore else, bad languageDictionary
  }

  return {
    type: constants.FETCH_LANGUAGE_DICTIONARY,
    meta: {
      onSuccess: () => onSuccess && onSuccess(response)
    },
    payload: {
      promise
    }
  };
}

