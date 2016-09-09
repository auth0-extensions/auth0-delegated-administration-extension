import axios from 'axios';
import * as constants from '../constants';

/*
 * Load all connections available in the Auth0 account.
 */
export function fetchScripts() {
  return {
    type: constants.FETCH_SCRIPTS,
    payload: {
      promise: axios.get('/api/scripts', {
        responseType: 'json'
      })
    }
  };
}
/*
 * Update configuration.
 */
export function updateScripts(data, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SCRIPTS,
      meta: {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchScripts());
        }
      },
      payload: {
        promise: axios.post('/api/scripts', data, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Update configuration.
 */
export function updateScript(script, data, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SCRIPT,
      meta: {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchScripts());
        }
      },
      payload: {
        promise: axios.post(`/api/scripts/${script}`, data, {
          responseType: 'json'
        })
      }
    });
  };
}

