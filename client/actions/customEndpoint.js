import axios from 'axios';
import * as constants from '../constants';
import { getAppSettings } from './auth';

export function fetchEndpoints() {
  return {
    type: constants.FETCH_CUSTOM_ENDPOINTS,
    payload: {
      promise: axios.get(`/api/customEndpoints`, {
        responseType: 'json'
      })
    }
  };
}

export function createEndpoint(name, method, handler) {
  return (dispatch) => {
    dispatch({
      type: constants.CREATE_CUSTOM_ENDPOINT,
      meta: {
        name,
        method,
        handler
      },
      payload: {
        promise: axios.post(`/api/customEndpoints`, { name, method, handler }, {
          responseType: 'json'
        })
      }
    });
  };
}

export function updateEndpoint(oldName, name, method, handler) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_CUSTOM_ENDPOINT,
      meta: {
        name,
        method,
        handler
      },
      payload: {
        promise: axios.put(`/api/customEndpoints/${oldName}`, { name, method, handler }, {
          responseType: 'json'
        })
      }
    });
  };
}

export function deleteEndpoint(name) {
  return (dispatch) => {
    dispatch({
      type: constants.DELETE_CUSTOM_ENDPOINT,
      meta: {
        name
      },
      payload: {
        promise: axios.delete(`/api/customEndpoints/${name}`, { }, {
          responseType: 'json'
        })
      }
    });
  };
}
