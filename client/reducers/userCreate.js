import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  validationErrors: { }
};

export const userCreate = createReducer(fromJS(initialState), {
  [constants.CREATE_USER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.CREATE_USER_REJECTED]: (state, action) => {
    const errorMessage = action.error ? action.errorMessage : null;
    return state.merge({
      loading: false,
      validationErrors: {},
      error: `An error occurred while creating the username: ${errorMessage}`
    });
  },
  [constants.CREATE_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
