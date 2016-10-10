import expect from 'expect';
import moment from 'moment';

import { logs } from '../../../client/reducers/logs';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: [],
  currentRecord: null
};

describe('logs reducer', () => {
  it('should return the initial state', () => {
    expect(
      logs(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_LOGS_PENDING (page=1)', () => {
    expect(
      logs({
        loading: false,
        error: null,
        records: [ 1, 2, 3 ],
        currentRecord: null
      }, {
        type: constants.FETCH_LOGS_PENDING,
        meta: {
          page: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: [ 1, 2, 3 ],
        currentRecord: null
      }
    );
  });

  it('should handle FETCH_LOGS_PENDING (page=0)', () => {
    expect(
      logs(initialState, {
        type: constants.FETCH_LOGS_PENDING,
        meta: {
          page: 0
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: [],
        currentRecord: null
      }
    );
  });

  it('should handle FETCH_LOGS_REJECTED', () => {
    expect(
      logs(initialState, {
        type: constants.FETCH_LOGS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the logs: ERROR',
        records: [],
        currentRecord: null
      }
    );
  });

  it('should handle FETCH_LOGS_FULFILLED', () => {
    expect(
      logs(initialState, {
        type: constants.FETCH_LOGS_FULFILLED,
        payload: {
          data: {
            total: 100,
            logs: [
              {
                _id: '49559553682563810286559514517590841916612030849441857538',
                client_name: 'My App',
                connection: 'Username-Password-Authentication',
                date: '2016-09-26T13:03:50.703Z',
                type: 'custom_type',
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
        },
        meta: {
          page: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            _id: '49559553682563810286559514517590841916612030849441857538',
            client_name: 'My App',
            connection: 'Username-Password-Authentication',
            date: '2016-09-26T13:03:50.703Z',
            type: {
              event: 'Unknown Error',
              icon: {
                name: '354',
                color: '#FFA500'
              }
            },
            user_name: 'test@mail.com',
            time_ago: moment('2016-09-26T13:03:50.703Z').fromNow()
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
            time_ago: moment('2016-09-26T13:03:36.005Z').fromNow()
          }
        ],
        currentRecord: null,
        total: 100,
        nextPage: 2
      }
    );
  });
});
