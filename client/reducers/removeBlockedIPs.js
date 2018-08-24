import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};

export const removeBlockedIPs = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_REMOVE_BLOCKED_IPS]: (state, action) =>
    state.merge({
      user: action.user,
      requesting: true
    }),
  [constants.CANCEL_REMOVE_BLOCKED_IPS]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REMOVE_BLOCKED_IPS_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_BLOCKED_IPS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.errorData
    }),
  [constants.REMOVE_BLOCKED_IPS_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
