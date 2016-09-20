import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  script: null
};

export const updateScript = createReducer(fromJS(initialState), {
    [constants.UPDATE_SCRIPT]: (state) =>
  state.merge({
    loading: true,
    error: null,
    script: action.meta.name
  }),
  [constants.UPDATE_SCRIPT_REJECTED]: (state, action) =>
  state.merge({
    loading: false,
    error: `An error occured while loading the connections: ${action.errorMessage}`,
    script: action.meta.name
  }),
  [constants.UPDATE_SCRIPT_FULFILLED]: (state, action) =>
  state.merge({
    loading: false,
    error: null,
    script: action.meta.name
  })
});
