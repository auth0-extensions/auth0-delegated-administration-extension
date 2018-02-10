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

export const passwordReset = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_PASSWORD_RESET]: (state, action) =>
    state.merge({
      ...initialState,
      user: action.user,
      connection: action.connection,
      requesting: true
    }),
  [constants.CANCEL_PASSWORD_RESET]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.PASSWORD_RESET_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.PASSWORD_RESET_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while resetting the password: ${action.errorMessage}`
    }),
  [constants.PASSWORD_RESET_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
