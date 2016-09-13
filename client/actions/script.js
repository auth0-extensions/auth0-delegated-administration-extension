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
export function updateScript(script, data, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SCRIPT,
      meta: {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchScript(script));
        }
      },
      payload: {
        promise: axios.post(`/api/scripts/${script}`, { script: data }, {
          responseType: 'json'
        })
      }
    });
  };
}
