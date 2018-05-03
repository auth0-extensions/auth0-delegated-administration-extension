import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  connection: null
};

export const passwordChange = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_PASSWORD_CHANGE]: (state, action) =>
    state.merge({
      ...initialState,
      user: action.user,
      connection: action.connection,
      requesting: true
    }),
  [constants.CANCEL_PASSWORD_CHANGE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.PASSWORD_CHANGE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.PASSWORD_CHANGE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.errorData
    }),
  [constants.PASSWORD_CHANGE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
