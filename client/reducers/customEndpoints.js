import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

export const customEndpoints = createReducer(fromJS({ }), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_CUSTOM_ENDPOINTS_PENDING]: state =>
    state
      .merge(fromJS({ loading: true, error: null, records: [] })),
  [constants.FETCH_CUSTOM_ENDPOINTS_REJECTED]: (state, action) =>
    state
      .merge(fromJS({ loading: false, error: action.errorData })),
  [constants.FETCH_CUSTOM_ENDPOINTS_FULFILLED]: (state, action) =>
    state
      .merge(fromJS({ loading: false, records: action.payload.data || [] })),
  [constants.CREATE_CUSTOM_ENDPOINT_PENDING]: state =>
    state
      .merge(fromJS({ loading: true, error: null })),
  [constants.CREATE_CUSTOM_ENDPOINT_REJECTED]: (state, action) =>
    state
      .merge(fromJS({ loading: true, error: action.errorData })),
  [constants.CREATE_CUSTOM_ENDPOINT_FULFILLED]: state =>
    state
      .merge(fromJS({ loading: false })),
  [constants.UPDATE_CUSTOM_ENDPOINT_PENDING]: state =>
    state
      .merge(fromJS({ loading: true, error: null })),
  [constants.UPDATE_CUSTOM_ENDPOINT_REJECTED]: (state, action) =>
    state
      .merge(fromJS({ loading: true, error: action.errorData })),
  [constants.UPDATE_CUSTOM_ENDPOINT_FULFILLED]: state =>
    state
      .merge(fromJS({ loading: false })),
  [constants.DELETE_CUSTOM_ENDPOINT_PENDING]: state =>
    state
      .merge(fromJS({ loading: true, error: null })),
  [constants.DELETE_CUSTOM_ENDPOINT_REJECTED]: (state, action) =>
    state
      .merge(fromJS({ loading: true, error: action.errorData })),
  [constants.DELETE_CUSTOM_ENDPOINT_FULFILLED]: state =>
    state
      .merge(fromJS({ loading: false }))
});
