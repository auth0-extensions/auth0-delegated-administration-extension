import axios from 'axios';
import * as constants from '../constants';

export function fetchUserLogs(userId) {
  return {
    type: constants.FETCH_USER_LOGS,
    meta: {
      userId
    },
    payload: {
      promise: axios.get(`/api/users/${userId}/logs`, {
        responseType: 'json'
      })
    }
  };
}
