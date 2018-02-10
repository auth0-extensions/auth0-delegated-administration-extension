import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};

export const unblock = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_UNBLOCK_USER]: (state, action) =>
    state.merge({
      user: action.user,
      requesting: true
    }),
  [constants.CANCEL_UNBLOCK_USER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UNBLOCK_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UNBLOCK_USER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while unblocking the user: ${action.errorMessage}`
    }),
  [constants.UNBLOCK_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
