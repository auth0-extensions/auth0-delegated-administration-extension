import expect from 'expect';
import moment from 'moment';

import { user } from '../../../client/reducers/user';
import * as constants from '../../../client/constants';
import { fromJS } from 'immutable';

const initialState = {
  loading: false,
  error: null,
  userId: null,
  record: fromJS({}),
  memberships: fromJS([]),
  connection: fromJS({}),
  logs: fromJS({
    loading: false,
    error: null,
    userId: null,
    records: fromJS([])
  }),
  devices: fromJS({
    loading: false,
    error: null,
    userId: null,
    records: fromJS({})
  })
};

// State after FETCH_USER_LOGS_PENDING / FETCH_USER_DEVICES_PENDING for user_1.
const logsRequestedState = { ...initialState, logs: initialState.logs.merge({ loading: true, userId: 'user_1' }) };
const devicesRequestedState = { ...initialState, devices: initialState.devices.merge({ loading: true, userId: 'user_1' }) };

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(
      user(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_USER_LOGS_PENDING', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_LOGS_PENDING,
        meta: { userId: 'user_1' }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: true,
          error: null,
          userId: 'user_1',
          records: fromJS([])
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: fromJS({})
        })
      }
    );
  });

  it('should handle FETCH_USER_LOGS_REJECTED', () => {
    expect(
      user(logsRequestedState, {
        type: constants.FETCH_USER_LOGS_REJECTED,
        meta: { userId: 'user_1' },
        errorData: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: {
            type: 'TEST',
            message: 'ERROR',
            status: 500
          },
          userId: 'user_1',
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_LOGS_FULFILLED', () => {
    expect(
      user(logsRequestedState, {
        type: constants.FETCH_USER_LOGS_FULFILLED,
        meta: { userId: 'user_1' },
        payload: {
          data: [
            {
              _id: '49559553682563810286559514517590841916612030849441857538',
              client_name: 'My App',
              connection: 'Username-Password-Authentication',
              date: '2016-09-26T13:03:50.703Z',
              type: 's',
              user_name: 'test@mail.com'
            },
            {
              _id: '49559553682563810286559514516535449676088458549131214850',
              client_name: 'My App',
              connection: 'Username-Password-Authentication',
              date: '2016-09-26T13:03:36.005Z',
              type: 's',
              user_name: 'test@mail.com'
            }
          ]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: 'user_1',
          records: [
            {
              _id: '49559553682563810286559514517590841916612030849441857538',
              client_name: 'My App',
              connection: 'Username-Password-Authentication',
              date: '2016-09-26T13:03:50.703Z',
              type: {
                event: 'Success Login',
                icon: {
                  name: '312',
                  color: 'green'
                }
              },
              user_name: 'test@mail.com',
              time_ago: moment('2016-09-26T13:03:50.703Z').fromNow(),
              shortType: 's'
            },
            {
              _id: '49559553682563810286559514516535449676088458549131214850',
              client_name: 'My App',
              connection: 'Username-Password-Authentication',
              date: '2016-09-26T13:03:36.005Z',
              type: {
                event: 'Success Login',
                icon: {
                  name: '312',
                  color: 'green'
                }
              },
              user_name: 'test@mail.com',
              time_ago: moment('2016-09-26T13:03:36.005Z').fromNow(),
              shortType: 's'
            }
          ]
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_LOGS_FULFILLED', () => {
    expect(
      user(logsRequestedState, {
        type: constants.FETCH_USER_LOGS_FULFILLED,
        meta: { userId: 'user_1' },
        payload: {
          data: [
            {
              _id: '49559553682563810286559514517590841916612030849441857538',
              client_name: 'My App',
              connection: 'Username-Password-Authentication',
              date: '2016-09-26T13:03:50.703Z',
              type: 's',
              user_name: 'test@mail.com'
            },
            {
              _id: '49559553682563810286559514516535449676088458549131214850',
              client_name: 'My App',
              connection: 'Username-Password-Authentication',
              date: '2016-09-26T13:03:36.005Z',
              type: 'custom_type',
              user_name: 'test@mail.com'
            }
          ]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: 'user_1',
          records: [
            {
              _id: '49559553682563810286559514517590841916612030849441857538',
              client_name: 'My App',
              connection: 'Username-Password-Authentication',
              date: '2016-09-26T13:03:50.703Z',
              type: {
                event: 'Success Login',
                icon: {
                  name: '312',
                  color: 'green'
                }
              },
              user_name: 'test@mail.com',
              time_ago: moment('2016-09-26T13:03:50.703Z').fromNow(),
              shortType: 's'
            },
            {
              _id: '49559553682563810286559514516535449676088458549131214850',
              client_name: 'My App',
              connection: 'Username-Password-Authentication',
              date: '2016-09-26T13:03:36.005Z',
              type: {
                event: 'Unknown Error',
                icon: {
                  name: '354',
                  color: '#FFA500'
                }
              },
              user_name: 'test@mail.com',
              time_ago: moment('2016-09-26T13:03:36.005Z').fromNow(),
              shortType: 'custom_type'
            }
          ]
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_LOGS_FULFILLED', () => {
    expect(
      user(logsRequestedState, {
        type: constants.FETCH_USER_LOGS_FULFILLED,
        meta: { userId: 'user_1' },
        payload: {
          data: []
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: 'user_1',
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: {}
        })
      }
    );
  });


  it('should handle FETCH_USER_DEVICES_PENDING', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_DEVICES_PENDING,
        meta: { userId: 'user_1' }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: []
        }),
        devices: fromJS({
          loading: true,
          error: null,
          userId: 'user_1',
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_DEVICES_REJECTED', () => {
    expect(
      user(devicesRequestedState, {
        type: constants.FETCH_USER_DEVICES_REJECTED,
        meta: { userId: 'user_1' },
        errorData: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: {
            type: 'TEST',
            message: 'ERROR',
            status: 500
          },
          userId: 'user_1',
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_DEVICES_FULFILLED', () => {
    expect(
      user(devicesRequestedState, {
        type: constants.FETCH_USER_DEVICES_FULFILLED,
        meta: { userId: 'user_1' },
        payload: {
          data: {
            devices: [
              {
                id: 'dcr_0000000000000001',
                device_name: 'ipad',
                device_id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'public_key',
                user_id: 'usr_5457edea1b8f33391a000004'
              },
              {
                id: 'dcr_0000000000000001',
                device_name: 'iphone',
                device_id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'public_key',
                user_id: 'usr_5457edea1b8f33391a000004'
              },
              {
                id: 'dcr_0000000000000001',
                device_name: 'iphone',
                device_id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'public_key',
                user_id: 'usr_5457edea1b8f33391a000004'
              },
              {
                id: 'dcr_0000000000000001',
                device_name: 'nexus',
                device_id: '550e8400-e29b-41d4-a716-446655440000',
                type: 'public_key',
                user_id: 'usr_5457edea1b8f33391a000004'
              }
            ]
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: 'user_1',
          records: {
            ipad: 1,
            iphone: 2,
            nexus: 1
          }
        })
      }
    );
  });

  it('should handle FETCH_USER_PENDING', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_PENDING,
        meta: {
          userId: 'user_1'
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        userId: 'user_1',
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_REJECTED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_REJECTED,
        errorData: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        },
        userId: null,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_FULFILLED state.user_id<>action.user_id', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_FULFILLED,
        payload: {
          data: {
            user: {
              user_id: 1
            }
          }
        }
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_USER_FULFILLED state.user_id==action.user_id', () => {
    expect(
      user({
        loading: false,
        error: null,
        userId: 1,
        record: fromJS({}),
        memberships: fromJS([]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: {}
        })
      }, {
        type: constants.FETCH_USER_FULFILLED,
        payload: {
          data: {
            user: {
              user_id: 1,
              name: 'test'
            },
            memberships: [ 'department_1', 'department_2' ],
            connection: {}
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        userId: 1,
        record: fromJS({
          user_id: 1,
          name: 'test'
        }),
        memberships: fromJS([ 'department_1', 'department_2' ]),
        connection: fromJS({}),
        logs: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          userId: null,
          records: {}
        })
      }
    );
  });

  describe('lazy logs/devices', () => {
    const run = (actions, state) => actions.reduce((acc, action) => user(acc, action), state);
    const pending = (type, userId, reset) => ({ type: `${type}_PENDING`, meta: { userId, reset } });
    const userFulfilled = (userId) => ({
      type: constants.FETCH_USER_FULFILLED,
      meta: { userId },
      payload: { data: { user: { user_id: userId }, memberships: [ 'dept' ], connection: { name: 'conn' } } }
    });
    const logsFulfilled = (userId) => ({
      type: constants.FETCH_USER_LOGS_FULFILLED,
      meta: { userId },
      payload: { data: [ { _id: `log_${userId}`, date: '2016-09-26T13:03:50.703Z', type: 's' } ] }
    });
    const devicesFulfilled = (userId) => ({
      type: constants.FETCH_USER_DEVICES_FULFILLED,
      meta: { userId },
      payload: { data: { devices: [ { device_name: `device_${userId}` } ] } }
    });
    const rejected = (type, userId) => ({
      type: `${type}_REJECTED`,
      meta: { userId },
      errorData: { type, message: 'ERROR', status: 403 }
    });

    const loadedUserA = () => run([
      pending(constants.FETCH_USER, 'user_a', true),
      userFulfilled('user_a'),
      pending(constants.FETCH_USER_LOGS, 'user_a'),
      logsFulfilled('user_a'),
      pending(constants.FETCH_USER_DEVICES, 'user_a'),
      devicesFulfilled('user_a')
    ]);

    it('should mark logs and devices as not requested in the initial state', () => {
      const state = user(undefined, {});
      expect(state.getIn([ 'logs', 'userId' ])).toEqual(null);
      expect(state.getIn([ 'devices', 'userId' ])).toEqual(null);
    });

    it('should store logs and devices for the requested user', () => {
      const state = loadedUserA();
      expect(state.get('logs').toJS()).toEqual({
        loading: false,
        error: null,
        userId: 'user_a',
        records: [ {
          _id: 'log_user_a',
          date: '2016-09-26T13:03:50.703Z',
          type: { event: 'Success Login', icon: { name: '312', color: 'green' } },
          shortType: 's',
          time_ago: moment('2016-09-26T13:03:50.703Z').fromNow()
        } ]
      });
      expect(state.get('devices').toJS()).toEqual({ loading: false, error: null, userId: 'user_a', records: { device_user_a: 1 } });
    });

    it('should reset the whole user state when loading a different user', () => {
      const state = user(loadedUserA(), pending(constants.FETCH_USER, 'user_b'));
      expect(state.toJS()).toEqual({
        ...user(undefined, {}).toJS(),
        loading: true,
        userId: 'user_b'
      });
    });

    it('should reset the whole user state when (re)opening the same user', () => {
      const state = user(loadedUserA(), pending(constants.FETCH_USER, 'user_a', true));
      expect(state.toJS()).toEqual({
        ...user(undefined, {}).toJS(),
        loading: true,
        userId: 'user_a'
      });
    });

    it('should keep the user, logs and devices when refetching the same user', () => {
      const before = loadedUserA();
      const state = user(before, pending(constants.FETCH_USER, 'user_a'));
      expect(state.get('loading')).toEqual(true);
      expect(state.get('record')).toBe(before.get('record'));
      expect(state.get('memberships')).toBe(before.get('memberships'));
      expect(state.get('logs')).toBe(before.get('logs'));
      expect(state.get('devices')).toBe(before.get('devices'));
    });

    it('should ignore logs and devices responses for a previous user', () => {
      const state = run([
        pending(constants.FETCH_USER, 'user_a', true),
        pending(constants.FETCH_USER_LOGS, 'user_a'),
        pending(constants.FETCH_USER_DEVICES, 'user_a'),
        pending(constants.FETCH_USER, 'user_b', true),
        logsFulfilled('user_a'),
        devicesFulfilled('user_a')
      ]);
      expect(state.get('userId')).toEqual('user_b');
      expect(state.get('logs').toJS()).toEqual({ loading: false, error: null, userId: null, records: [] });
      expect(state.get('devices').toJS()).toEqual({ loading: false, error: null, userId: null, records: {} });
    });

    it('should ignore a slow logs/devices response for a user when another user was requested since', () => {
      const state = run([
        pending(constants.FETCH_USER_LOGS, 'user_a'),
        pending(constants.FETCH_USER_DEVICES, 'user_a'),
        pending(constants.FETCH_USER_LOGS, 'user_b'),
        pending(constants.FETCH_USER_DEVICES, 'user_b'),
        logsFulfilled('user_a'),
        rejected(constants.FETCH_USER_DEVICES, 'user_a')
      ]);
      expect(state.get('logs').toJS()).toEqual({ loading: true, error: null, userId: 'user_b', records: [] });
      expect(state.get('devices').toJS()).toEqual({ loading: true, error: null, userId: 'user_b', records: {} });
    });

    it('should ignore stale logs/devices failures for a previous user', () => {
      const state = run([
        pending(constants.FETCH_USER, 'user_a', true),
        pending(constants.FETCH_USER_LOGS, 'user_a'),
        pending(constants.FETCH_USER, 'user_b', true),
        rejected(constants.FETCH_USER_LOGS, 'user_a'),
        rejected(constants.FETCH_USER, 'user_a')
      ]);
      expect(state.get('error')).toEqual(null);
      expect(state.get('loading')).toEqual(true);
      expect(state.getIn([ 'logs', 'error' ])).toEqual(null);
    });

    it('should keep the user details when logs or devices fail', () => {
      const state = run([
        pending(constants.FETCH_USER_LOGS, 'user_a'),
        rejected(constants.FETCH_USER_LOGS, 'user_a'),
        pending(constants.FETCH_USER_DEVICES, 'user_a'),
        rejected(constants.FETCH_USER_DEVICES, 'user_a')
      ], loadedUserA());
      expect(state.getIn([ 'record', 'user_id' ])).toEqual('user_a');
      expect(state.get('error')).toEqual(null);
      expect(state.getIn([ 'logs', 'error', 'status' ])).toEqual(403);
      expect(state.getIn([ 'logs', 'userId' ])).toEqual('user_a');
      expect(state.getIn([ 'devices', 'error', 'status' ])).toEqual(403);
      expect(state.getIn([ 'devices', 'userId' ])).toEqual('user_a');
    });
  });
});
