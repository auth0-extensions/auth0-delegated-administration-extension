import axios from 'axios';
import * as constants from '../constants';

export function fetchLogs(page = 0) {
  return {
    type: constants.FETCH_LOGS,
    meta: {
      page
    },
    payload: {
      promise: axios.get('/api/logs', {
        params: {
          page
        },
        responseType: 'json'
      })
    }
  };
}

export function fetchLog(logId) {
  return {
    type: constants.FETCH_LOG,
    meta: {
      logId
    },
    payload: {
      promise: axios.get(`/api/logs/${logId}`, {
        responseType: 'json'
      })
    }
  };
}

export function clearLog() {
  return {
    type: constants.CLEAR_LOG
  };
}
