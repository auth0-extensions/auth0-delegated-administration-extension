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

/*
 * Fetch the user logs unless they are already loaded (or loading) for this user.
 * A failed load is retried.
 */
export function fetchUserLogsIfNeeded(userId) {
  return (dispatch, getState) => {
    const logs = getState().user.get('logs');
    if (logs.get('userId') === userId && (logs.get('loading') || !logs.get('error'))) {
      return;
    }

    dispatch(fetchUserLogs(userId));
  };
}
