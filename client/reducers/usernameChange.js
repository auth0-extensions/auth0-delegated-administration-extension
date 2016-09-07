import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  userName: null,
  userEmail: null,
  userNameToChange: null,
  connection: null
};

export const usernameChange = createReducer(fromJS(initialState), {
  [constants.REQUEST_USERNAME_CHANGE]: (state, action) =>
    state.merge({
      ...initialState,
      userId: action.user.user_id,
      userName: action.user.name || action.user.user_name || action.user.email,
      userNameToChange: action.user.nickname,
      userEmail: action.user.email,
      connection: action.connection,
      requesting: true
    }),
  [constants.CANCEL_USERNAME_CHANGE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.USERNAME_CHANGE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.USERNAME_CHANGE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while changing the username: ${action.errorMessage}`
    }),
  [constants.USERNAME_CHANGE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
