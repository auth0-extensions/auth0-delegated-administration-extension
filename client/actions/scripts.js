import axios from 'axios';
import * as constants from '../constants';

/*
 * Load all connections available in the Auth0 account.
 */
export function fetchScripts() {
  return {
    type: constants.FETCH_SCRIPTS,
    payload: {
      promise: axios.get('/api/scripts', {
        responseType: 'json'
      })
    }
  };
}
