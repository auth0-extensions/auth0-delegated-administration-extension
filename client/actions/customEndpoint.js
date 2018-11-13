import axios from 'axios';
import * as constants from '../constants';

export function fetchEndpoints() {
  return {
    type: constants.FETCH_CUSTOM_ENDPOINTS,
    payload: {
      promise: axios.get('/api/customEndpoints', {
        responseType: 'json'
      })
    }
  };
}

export function createEndpoint(name, method, handler, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.CREATE_CUSTOM_ENDPOINT,
      meta: {
        name,
        method,
        handler,
        onSuccess
      },
      payload: {
        promise: axios.post('/api/customEndpoints', { name, method, handler }, {
          responseType: 'json'
        })
      }
    });
  };
}

export function updateEndpoint(id, name, method, handler, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_CUSTOM_ENDPOINT,
      meta: {
        name,
        method,
        handler,
        onSuccess
      },
      payload: {
        promise: axios.put(`/api/customEndpoints/${id}`, { name, method, handler }, {
          responseType: 'json'
        })
      }
    });
  };
}

export function deleteEndpoint(name, onSuccess) {
  return (dispatch) => {
    dispatch({
      type: constants.DELETE_CUSTOM_ENDPOINT,
      meta: {
        name,
        onSuccess
      },
      payload: {
        promise: axios.delete(`/api/customEndpoints/${name}`, { }, {
          responseType: 'json'
        })
      }
    });
  };
}
