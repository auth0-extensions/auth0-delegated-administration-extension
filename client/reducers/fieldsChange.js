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

export const fieldsChange = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_FIELDS_CHANGE]: (state, action) =>
    state.merge({
      ...initialState,
      userId: action.payload.user.user_id,
      record: action.payload.user
    }),
  [constants.CANCEL_FIELDS_CHANGE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.FIELDS_CHANGE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.FIELDS_CHANGE_REJECTED]: (state, action) => {
    const errorMessage = action.error ? action.errorMessage : null;
    return state.merge({
      loading: false,
      validationErrors: {},
      error: `An error occurred while creating the user: ${errorMessage}`
    });
  },
  [constants.FIELDS_CHANGE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
