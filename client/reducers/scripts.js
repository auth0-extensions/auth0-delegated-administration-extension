import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: null
};

export const scripts = createReducer(fromJS(initialState), {
  [constants.FETCH_SCRIPTS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_SCRIPTS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the connections: ${action.errorMessage}`
    }),
  [constants.FETCH_SCRIPTS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload.data)
    })
});
