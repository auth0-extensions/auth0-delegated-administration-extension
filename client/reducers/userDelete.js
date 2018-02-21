import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};

export const userDelete = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_DELETE_USER]: (state, action) =>
    state.merge({
      ...initialState,
      user: action.user,
      requesting: true
    }),
  [constants.CANCEL_DELETE_USER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_USER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: {
        message: action.errorMessage,
        type: 'delete_user'
      }
    }),
  [constants.DELETE_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
