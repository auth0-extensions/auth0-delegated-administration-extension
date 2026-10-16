import moment from 'moment';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import logTypes from '../utils/logTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  userId: null,
  record: fromJS({}),
  memberships: fromJS([]),
  connection: fromJS({}),
  // logs and devices are fetched lazily (when their tab is opened). Their userId is the user the
  // slice was requested for; null means "not requested yet" for the current user.
  logs: {
    loading: false,
    error: null,
    userId: null,
    records: fromJS([])
  },
  devices: {
    loading: false,
    error: null,
    userId: null,
    records: fromJS({})
  }
};

// Ignore responses for a user other than the one the slice was last requested for (e.g. the
// admin navigated to another user while the request was in flight).
const isStale = (state, action) => !action.meta || action.meta.userId !== state.get('userId');

const userLogs = createReducer(fromJS(initialState.logs), {
  [constants.FETCH_USER_LOGS_PENDING]: (state, action) =>
    state.merge({
      ...initialState.logs,
      loading: true,
      userId: action.meta.userId
    }),
  [constants.FETCH_USER_LOGS_REJECTED]: (state, action) => {
    if (isStale(state, action)) {
      return state;
    }

    return state.merge({
      ...initialState.logs,
      loading: false,
      userId: action.meta.userId,
      error: fromJS(action.errorData)
    });
  },
  [constants.FETCH_USER_LOGS_FULFILLED]: (state, action) => {
    if (isStale(state, action)) {
      return state;
    }

    return state.merge({
      loading: false,
      records: fromJS(typeof action.payload.data !== 'undefined' ?
        action.payload.data.map(log => {
          log.time_ago = moment(log.date).fromNow();
          log.shortType = log.type;
          log.type = logTypes[log.type];
          if (!log.type) {
            log.type = {
              event: 'Unknown Error',
              icon: {
                name: '354',
                color: '#FFA500'
              }
            };
          }
          return log;
        }) :
        []
      )
    });
  }
});

const userDevices = createReducer(fromJS(initialState.devices), {
  [constants.FETCH_USER_DEVICES_PENDING]: (state, action) =>
    state.merge({
      ...initialState.devices,
      loading: true,
      userId: action.meta.userId
    }),
  [constants.FETCH_USER_DEVICES_REJECTED]: (state, action) => {
    if (isStale(state, action)) {
      return state;
    }

    return state.merge({
      ...initialState.devices,
      userId: action.meta.userId,
      error: fromJS(action.errorData)
    });
  },
  [constants.FETCH_USER_DEVICES_FULFILLED]: (state, action) => {
    if (isStale(state, action)) {
      return state;
    }

    const devices = action.payload.data.devices.reduce((map, device) => {
      map[device.device_name] = (map[device.device_name] || 0) + 1;
      return map;
    }, { });

    return state.merge({
      loading: false,
      records: fromJS(devices)
    });
  }
});

export const user = createReducer(fromJS(initialState), {
  [constants.FETCH_USER_PENDING]: (state, action) => {
    const { userId, reset } = action.meta;

    // Loading a different user (or (re)opening the user page): drop everything from the previous
    // user so it's never shown under the new one and the lazy tabs are fetched again.
    if (reset || userId !== state.get('userId')) {
      return fromJS(initialState).merge({
        loading: true,
        userId
      });
    }

    // Refetch of the same user (e.g. after block/unblock): keep the loaded logs/devices.
    return state.merge({
      error: null,
      loading: true
    });
  },
  [constants.FETCH_USER_REJECTED]: (state, action) => {
    // Late failure for a user we already navigated away from.
    if (action.meta && action.meta.userId !== state.get('userId')) {
      return state;
    }

    return state.merge({
      loading: false,
      error: action.errorData
    });
  },
  [constants.FETCH_USER_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data.user.user_id !== state.get('userId')) {
      return state;
    }

    return state.merge({
      loading: false,
      record: fromJS(data.user),
      memberships: fromJS(data.memberships),
      connection: fromJS(data.connection)
    });
  },

  [constants.FETCH_USER_LOGS_PENDING]: (state, action) =>
    state.merge({
      logs: userLogs(state.get('logs'), action)
    }),
  [constants.FETCH_USER_LOGS_REJECTED]: (state, action) =>
    state.merge({
      logs: userLogs(state.get('logs'), action)
    }),
  [constants.FETCH_USER_LOGS_FULFILLED]: (state, action) =>
    state.merge({
      logs: userLogs(state.get('logs'), action)
    }),

  [constants.FETCH_USER_DEVICES_PENDING]: (state, action) =>
    state.merge({
      devices: userDevices(state.get('devices'), action)
    }),
  [constants.FETCH_USER_DEVICES_REJECTED]: (state, action) =>
    state.merge({
      devices: userDevices(state.get('devices'), action)
    }),
  [constants.FETCH_USER_DEVICES_FULFILLED]: (state, action) =>
    state.merge({
      devices: userDevices(state.get('devices'), action)
    })
});
