import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};

export const verificationEmail = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_RESEND_VERIFICATION_EMAIL]: (state, action) =>
    state.merge({
      ...initialState,
      user: action.user,
      requesting: true
    }),
  [constants.CANCEL_RESEND_VERIFICATION_EMAIL]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.RESEND_VERIFICATION_EMAIL_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.RESEND_VERIFICATION_EMAIL_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.errorData
    }),
  [constants.RESEND_VERIFICATION_EMAIL_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
