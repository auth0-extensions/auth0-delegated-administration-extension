import axios from 'axios';
import * as constants from '../constants';
import { getAppSettings } from './auth';

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

export function updateScript(name, script) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SCRIPT,
      meta: {
        name,
        script,
        onSuccess: () => {
          if (name === 'settings') {
            return dispatch(getAppSettings());
          }
        }
      },
      payload: {
        promise: axios.post(`/api/scripts/${name}`, { script }, {
          responseType: 'json'
        })
      }
    });
  };
}
