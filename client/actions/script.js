import axios from 'axios';
import * as constants from '../constants';

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

export function updateScript(script, data) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_SCRIPT,
      meta: {
        name: script
      },
      payload: {
        promise: axios.post(`/api/scripts/${script}`, { script: data }, {
          responseType: 'json'
        })
      }
    });
  };
}
