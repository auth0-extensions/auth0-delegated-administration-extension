import axios from 'axios';
import jwtDecode from 'jwt-decode';

import * as constants from '../constants';
import { show, parseHash } from '../utils/lock';

export function login(returnUrl) {
  show(returnUrl);

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
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    if (window.location.hash) {
      const { id_token: idToken } = parseHash(window.location.hash);
      if (idToken) {
        const decodedToken = jwtDecode(idToken);
        if (isExpired(decodedToken)) {
          return;
        }

        axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;

        dispatch({
          type: constants.LOADED_TOKEN,
          payload: {
            token: idToken
          }
        });

        dispatch({
          type: constants.LOGIN_SUCCESS,
          payload: {
            token: idToken,
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
        responseType: 'json'
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
