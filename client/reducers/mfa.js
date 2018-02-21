import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  provider: null
};

export const mfa = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_REMOVE_MULTIFACTOR]: (state, action) =>
    state.merge({
      ...initialState,
      user: action.user,
      provider: action.provider,
      requesting: true
    }),
  [constants.CANCEL_REMOVE_MULTIFACTOR]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REMOVE_MULTIFACTOR_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_MULTIFACTOR_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: {
        message: action.errorMessage,
        type: 'remove_mfa'
      }
    }),
  [constants.REMOVE_MULTIFACTOR_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
