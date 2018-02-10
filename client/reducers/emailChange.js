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

export const emailChange = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_EMAIL_CHANGE]: (state, action) =>
    state.merge({
      ...initialState,
      user: action.user,
      connection: action.connection,
      requesting: true
    }),
  [constants.CANCEL_EMAIL_CHANGE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.EMAIL_CHANGE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.EMAIL_CHANGE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the email: ${action.errorMessage}`
    }),
  [constants.EMAIL_CHANGE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
