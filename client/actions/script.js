import axios from 'axios';
import * as constants from '../constants';

/*
 * Load all connections available in the Auth0 account.
 */
export function fetchScript(name) {
  return {
    type: constants.FETCH_SCRIPT,
    payload: {
      promise: axios.get(`/api/scripts/${name}`, {
        responseType: 'json'
      })
    },
    meta: {
      name
    }
  };
}
/*
 * Update configuration.
 */
export function updateScripts(data, onSuccess) {
  console.log('Update:', data);
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SCRIPTS,
      meta: {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchScript(data.name));
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
  console.log('Update single', script, data);
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SCRIPT,
      meta: {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchScript(data.name));
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
