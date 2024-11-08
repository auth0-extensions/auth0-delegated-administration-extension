import { fromJS } from 'immutable';
import * as constants from '../constants';
import logTypes from '../utils/logTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: fromJS([]),
  currentRecord: null
};

export const logs = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_LOGS_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      loading: true,
      records: fromJS(action.meta.page === 0 ? [] : state.get('records')),
    }),
  [constants.FETCH_LOGS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.errorData
    }),
  [constants.FETCH_LOGS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      nextPage: action.meta.page + 1,
      records: fromJS(state.get('records').concat(fromJS(data.map(log => {
        log.shortType = log.type;
        log.type = logTypes[log.type];
        if (!log.type) {
          log.type = {
            // Don't do this, need to handle it elsewhere so language dictionary can do it: event: 'Unknown Event',
            icon: {
              name: '354',
              color: '#FFA500'
            }
          };
        }
        return log;
      }))))
    });
  }
});
