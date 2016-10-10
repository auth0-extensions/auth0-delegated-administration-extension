import axios from 'axios';
import * as constants from '../constants';

export function fetchUserDevices(userId) { // eslint-disable-line import/prefer-default-export
  return {
    type: constants.FETCH_USER_DEVICES,
    meta: {
      userId
    },
    payload: {
      promise: axios.get(`/api/users/${userId}/devices`, {
        responseType: 'json'
      })
    }
  };
}
