import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { role: 0, memberships: [], createMemberships: false }
};

export const accessLevel = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_ACCESS_LEVEL_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_ACCESS_LEVEL_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: {
        message: action.errorMessage,
        type: 'load_settings'
      },
      record: fromJS({ ...initialState.record, role: 2 })
    }),
  [constants.FETCH_ACCESS_LEVEL_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      record: fromJS(action.payload.data)
    })
});
