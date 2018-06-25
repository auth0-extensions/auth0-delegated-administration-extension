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
  },
  scope: 'openid roles',
  responseType: 'id_token',
  redirectUri: `${window.config.BASE_URL}/login`
});

export function login(returnUrl, locale) {
  sessionStorage.setItem('delegated-admin:returnTo', returnUrl || '/users');

  webAuth.authorize({
    ui_locales: locale
  });

  return {
    type: constants.SHOW_LOGIN
  };
}

/** Checks if a decoded token is expired **/
function isTokenExpired(decodedToken) {
  return isDateExpired(decodedToken.exp);
}

/** Checks if a given token exp is expired **/
function isDateExpired(exp) {

  // if there is no expiration date, return
  if (typeof exp === 'undefined') return true;

  // convert to date and store
  const d = new Date(0);
  d.setUTCSeconds(exp);

  // check if date is expired
  var isExpired = !(d.valueOf() > (new Date().valueOf() + (30)));

  return isExpired;
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

// calls checkSession to refresh idToken
function refreshToken() {
  return new Promise((resolve, reject) => {
    // invoke check session to get a new token
    webAuth.checkSession({},
      function(err, result) {
        if (err) { // there was an error
          reject(err);
        } else {  // we got a token
          resolve(result);
        }
      }
    );
  });
}

const processTokens = (dispatch, apiToken, returnTo) => {

  return new Promise((resolve, reject) => {

    // check token expiration date
    const decodedToken = jwtDecode(apiToken);
    if (isTokenExpired(decodedToken)) {
      return;
    }

    axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;
    axios.defaults.headers.common['dae-locale'] = window.config.LOCALE || 'en';

    sessionStorage.setItem('delegated-admin:apiToken:exp', decodedToken.exp);

    // creates an interceptor to refresh token if needed
    axios.interceptors.request.use((config) => {

      // get token expiration from storage
      const exp = sessionStorage.getItem('delegated-admin:apiToken:exp');

      // if there is no token, or it is expired, try to get one
      if (isDateExpired(exp)) {
        return refreshToken().then((tokenResponse) => {
          // we got one, store and load credentials
          return processTokens(dispatch, tokenResponse.idToken).then(() => {
            config.headers.Authorization = axios.defaults.headers.common.Authorization;
            return Promise.resolve(config)
          });
        })
          .catch(error => {
            login(returnTo, window.config.LOCALE || 'en');
            return Promise.reject(error);
          })
      } else {
        // token is not expired, move on.
        return config;
      }
    }, (error) => {
      return Promise.reject(error);
    });

    axios.interceptors.response.use(response => response, (error) => {
      const value = error.response;
      if (value && value.status === 401 && value.data.message === 'TokenExpired') {
        // renewToken performs authentication using username/password saved in sessionStorage/sessionStorage
        return refreshToken().then((tokenResponse) => {
          // we got one, store and load credentials
          return processTokens(dispatch, tokenResponse.idToken).then(() => {
            config.headers.Authorization = axios.defaults.headers.common.Authorization;
            return axios.request(error.config);
          });
        });
      }
      return Promise.reject(error);
    });

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

    resolve();

  });
};

export function loadCredentials() {
  return (dispatch) => {

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

