import axios from 'axios';
import * as constants from '../constants';

export function fetchApplications() { // eslint-disable-line import/prefer-default-export
  return {
    type: constants.FETCH_APPLICATIONS,
    payload: {
      promise: axios.get('/api/applications', {
        responseType: 'json'
      })
    }
  };
}
