import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { access_level: 0, memberships: [], createMemberships: false }
};

export const accessLevel = createReducer(fromJS(initialState), {
  [constants.FETCH_ACCESS_LEVEL_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_ACCESS_LEVEL_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the settings: ${action.errorMessage}`
    }),
  [constants.FETCH_ACCESS_LEVEL_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      record: fromJS(action.payload.data)
    })
});
