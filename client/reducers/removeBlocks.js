import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};

export const removeBlocks = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.REQUEST_REMOVE_BLOCKS]: (state, action) =>
    state.merge({
      user: action.user,
      requesting: true
    }),
  [constants.CANCEL_REMOVE_BLOCKS]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REMOVE_BLOCKS_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_BLOCKS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.errorData
    }),
  [constants.REMOVE_BLOCKS_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
