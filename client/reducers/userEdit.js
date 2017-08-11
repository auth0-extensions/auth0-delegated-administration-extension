import _ from 'lodash';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  userId: null,
  record: null,
  loading: false,
  validationErrors: {}
};

export const userEdit = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_EDIT_USER]: (state, action) =>
    state.merge({
      ...initialState,
      userId: action.payload.user.user_id,
      record: action.payload.user
    }),
  [constants.CANCEL_EDIT_USER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.EDIT_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.EDIT_USER_REJECTED]: (state, action) => {
    const errorMessage = action.error ? action.errorMessage : null;
    return state.merge({
      loading: false,
      validationErrors: {},
      error: `An error occurred while creating the user: ${errorMessage}`
    });
  },
  [constants.EDIT_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
