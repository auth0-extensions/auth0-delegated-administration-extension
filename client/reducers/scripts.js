import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

export const scripts = createReducer(fromJS({ }), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_SCRIPT_PENDING]: (state, action) =>
    state
      .setIn([ action.meta.name ], fromJS({ loading: true, error: null, script: null })),
  [constants.FETCH_SCRIPT_REJECTED]: (state, action) =>
    state
      .setIn([ action.meta.name ], fromJS({ loading: false, error: `An error occured while loading the script: ${action.errorMessage}` })),
  [constants.FETCH_SCRIPT_FULFILLED]: (state, action) =>
    state
      .setIn([ action.meta.name ], fromJS({ loading: false, script: action.payload.data.script })),
  [constants.UPDATE_SCRIPT_PENDING]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], true)
      .setIn([ action.meta.name, 'script' ], action.meta.script),
  [constants.UPDATE_SCRIPT_REJECTED]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], false)
      .setIn([ action.meta.name, 'error' ], `An error occured while saving the script: ${action.errorMessage}`),
  [constants.UPDATE_SCRIPT_FULFILLED]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], false)
});
