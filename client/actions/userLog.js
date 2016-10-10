import axios from 'axios';
import * as constants from '../constants';

export function fetchUserLogs(userId) { // eslint-disable-line import/prefer-default-export
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
