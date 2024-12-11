import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};

export const block = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_BLOCK_USER]: (state, action) =>
    state.merge({
      user: fromJS(action.user),
      requesting: true
    }),
  [constants.CANCEL_BLOCK_USER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.BLOCK_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.BLOCK_USER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.errorData
    }),
  [constants.BLOCK_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
