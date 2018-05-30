import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import logTypes from '../utils/logTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  logId: null,
  record: Map()
};

export const log = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.CLEAR_LOG]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.FETCH_LOG_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      loading: true,
      logId: action.meta.logId
    }),
  [constants.FETCH_LOG_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.errorData
    }),
  [constants.FETCH_LOG_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data.log._id !== state.get('logId')) { // eslint-disable-line no-underscore-dangle
      return state;
    }

    let logType = logTypes[data.log.type];
    if (!logType) {
      logType = {
        // Don't do this, need to handle it elsewhere so language dictionary can do it: event: `Unknown Log Type: ${data.log.type}`,
        icon: {
          name: '354',
          color: '#FFA500'
        }
      };
    }

    data.log.shortType = data.log.type;
    data.log.type = logType.event;

    return state.merge({
      loading: false,
      record: fromJS(data.log)
    });
  }
});
