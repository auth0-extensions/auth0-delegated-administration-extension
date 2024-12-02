import expect from 'expect';
import moment from 'moment';

import { user } from '../../../client/reducers/user';
import * as constants from '../../../client/constants';
import {fromJS} from "immutable";

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
    records: fromJS([])
  }),
  devices: fromJS({
    loading: false,
    error: null,
    records: fromJS({})
  })
};

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
        type: constants.FETCH_USER_LOGS_PENDING
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
          records: fromJS([])
        }),
        devices: fromJS({
          loading: false,
          error: null,
          records: fromJS({})
        })
      }
    );
  });

  it('should handle FETCH_USER_LOGS_REJECTED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_LOGS_REJECTED,
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
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_LOGS_FULFILLED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_LOGS_FULFILLED,
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
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_LOGS_FULFILLED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_LOGS_FULFILLED,
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
              shortType: "s"
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
              shortType: "custom_type"
            }
          ]
        }),
        devices: fromJS({
          loading: false,
          error: null,
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_LOGS_FULFILLED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_LOGS_FULFILLED,
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
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          records: {}
        })
      }
    );
  });


  it('should handle FETCH_USER_DEVICES_PENDING', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_DEVICES_PENDING
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
          records: []
        }),
        devices: fromJS({
          loading: true,
          error: null,
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_DEVICES_REJECTED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_DEVICES_REJECTED,
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
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: {
            type: 'TEST',
            message: 'ERROR',
            status: 500
          },
          records: {}
        })
      }
    );
  });

  it('should handle FETCH_USER_DEVICES_FULFILLED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_DEVICES_FULFILLED,
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
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          records: {
            ipad: 1,
            iphone: 2,
            nexus: 1,
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
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
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
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
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
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
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
          records: []
        }),
        devices: fromJS({
          loading: false,
          error: null,
          records: {}
        })
      }
    );
  });
});
