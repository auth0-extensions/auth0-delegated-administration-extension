import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false
};

export const userCreate = createReducer(fromJS(initialState), {
  [constants.CREATE_USER]: (state, action) =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.CREATE_USER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.errorMessage
    }),
  [constants.CREATE_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
