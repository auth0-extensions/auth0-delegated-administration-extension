import axios from 'axios';
import * as constants from '../constants';

export function fetchUserDevices(userId) {  
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

/*
 * Fetch the user devices unless they are already loaded (or loading) for this user.
 * A failed load is retried.
 */
export function fetchUserDevicesIfNeeded(userId) {
  return (dispatch, getState) => {
    const devices = getState().user.get('devices');
    if (devices.get('userId') === userId && (devices.get('loading') || !devices.get('error'))) {
      return;
    }

    dispatch(fetchUserDevices(userId));
  };
}
