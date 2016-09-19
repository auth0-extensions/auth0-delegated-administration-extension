import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  validationErrors: { }
};

export const scriptsUpdate = createReducer(fromJS(initialState), {
  [constants.UPDATE_SCRIPT]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UPDATE_SCRIPT_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UPDATE_SCRIPT_REJECTED]: (state, action) => {
    const errorMessage = action.error ? action.errorMessage : null;
    return state.merge({
      loading: false,
      validationErrors: {},
      error: `An error occurred while updating script: ${errorMessage}`
    });
  },
  [constants.UPDATE_SCRIPT_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
