import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { settings: { dict: { title: '', memberships: '' }, css: '' } }
};

export const settings = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_SETTINGS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_SETTINGS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the connections: ${action.errorMessage}`
    }),
  [constants.FETCH_SETTINGS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      record: fromJS(action.payload.data)
    })

});
