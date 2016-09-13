import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: { }
};

export const scripts = createReducer(fromJS(initialState), {
  [constants.FETCH_SCRIPT_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_SCRIPT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the script: ${action.errorMessage}`
    }),
  [constants.FETCH_SCRIPT_FULFILLED]: (state, action) =>
    state
      .setIn([ 'loading' ], false)
      .setIn([ 'records', action.meta.name ], fromJS(action.payload.data.script))
});
