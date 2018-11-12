import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

export const customEndpoints = createReducer(fromJS({ }), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_CUSTOM_ENDPOINTS_PENDING]: (state) =>
    state
      .merge(fromJS({ loading: true, error: null, records: null, token: null })),
  [constants.FETCH_CUSTOM_ENDPOINTS_REJECTED]: (state, action) =>
    state
      .merge(fromJS({ loading: false, error: action.errorData })),
  [constants.FETCH_CUSTOM_ENDPOINTS_FULFILLED]: (state, action) =>
    state
      .merge(fromJS({ loading: false, records: action.payload.data })),
  [constants.CREATE_CUSTOM_ENDPOINT_PENDING]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], true)
      .setIn([ action.meta.name, 'handler' ], action.meta.handler),
  [constants.CREATE_CUSTOM_ENDPOINT_REJECTED]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], false)
      .setIn([ action.meta.name, 'error' ], action.errorData),
  [constants.CREATE_CUSTOM_ENDPOINT_FULFILLED]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], false),
  [constants.UPDATE_CUSTOM_ENDPOINT_PENDING]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], true)
      .setIn([ action.meta.name, 'handler' ], action.meta.handler),
  [constants.UPDATE_CUSTOM_ENDPOINT_REJECTED]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], false)
      .setIn([ action.meta.name, 'error' ], action.errorData),
  [constants.UPDATE_CUSTOM_ENDPOINT_FULFILLED]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], false),
  [constants.DELETE_CUSTOM_ENDPOINT_PENDING]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], true),
  [constants.DELETE_CUSTOM_ENDPOINT_REJECTED]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], false)
      .setIn([ action.meta.name, 'error' ], action.errorData),
  [constants.DELETE_CUSTOM_ENDPOINT_FULFILLED]: (state, action) =>
    state
      .setIn([ action.meta.name, 'loading' ], false)
});
