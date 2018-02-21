import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  record: null,
  loading: false,
  validationErrors: { }
};

export const userCreate = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_CREATE_USER]: (state, action) =>
    state.merge({
      ...initialState,
      record: {
        memberships: action.payload.memberships,
        connection: action.payload.connection
      }
    }),
  [constants.CANCEL_CREATE_USER]: (state) =>
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
      error: {
        message: action.errorMessage,
        type: 'create_user'
      }
    });
  },
  [constants.CREATE_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
