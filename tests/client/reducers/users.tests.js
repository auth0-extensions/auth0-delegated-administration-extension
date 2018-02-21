import expect from 'expect';
import moment from 'moment';

import { users } from '../../../client/reducers/users';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: [],
  total: 0,
  currentPage: 1,
  pages: 1,
  searchValue: '',
  sortProperty: 'last_login',
  sortOrder: -1
};

describe('users reducer', () => {
  it('should return the initial state', () => {
    expect(
      users(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_USERS_PENDING', () => {
    expect(
      users(initialState, {
        type: constants.FETCH_USERS_PENDING,
        meta: {
          page: 0
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: [],
        currentPage: 1,
        pages: 1,
        total: 0,
        searchValue: undefined,
        sortProperty: undefined,
        sortOrder: undefined
      }
    );
  });

  it('should handle FETCH_USERS_PENDING a second time', () => {
    expect(
      users({
        loading: false,
        error: null,
        pages: 2,
        records: [ 'test' ],
        total: 0
      }, {
        type: constants.FETCH_USERS_PENDING,
        meta: {
          page: 1,
          searchValue: 'value',
          sortProperty: 'email',
          sortOrder: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: [ 'test' ],
        total: 0,
        currentPage: 1,
        pages: 2,
        searchValue: 'value',
        sortProperty: 'email',
        sortOrder: 1
      }
    );
  });

  it('should handle FETCH_USERS_REJECTED', () => {
    expect(
      users(initialState, {
        type: constants.FETCH_USERS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: {
          message: 'ERROR',
          type: 'load_users'
        },
        records: [],
        total: 0,
        currentPage: 1,
        pages: 1,
        searchValue: '',
        sortProperty: 'last_login',
        sortOrder: -1
      }
    );
  });

  it('should handle FETCH_USERS_FULFILLED', () => {
    expect(
      users(initialState, {
        type: constants.FETCH_USERS_FULFILLED,
        payload: {
          data: {
            users: [
              {
                user_id: 1,
                name: 'test',
                blocked: false,
                email: 'test@mail.com',
                last_login: '2016-09-27T10:54:48.864Z',
                logins_count: 1882
              },
              {
                user_id: 2,
                name: 'test_2',
                blocked: false,
                email: 'test2@mail.com',
                logins_count: 0
              }
            ],
            total: 2
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
            user_id: 1,
            name: 'test',
            blocked: false,
            email: 'test@mail.com',
            last_login: '2016-09-27T10:54:48.864Z',
            logins_count: 1882,
            last_login_relative: moment('2016-09-27T10:54:48.864Z').fromNow()
          },
          {
            user_id: 2,
            name: 'test_2',
            blocked: false,
            email: 'test2@mail.com',
            logins_count: 0,
            last_login_relative: 'Never'
          }
        ],
        total: 2,
        nextPage: 2,
        currentPage: 1,
        pages: 1,
        searchValue: '',
        sortProperty: 'last_login',
        sortOrder: -1
      }
    );
  });

  it('should handle BLOCK_USER_FULFILLED', () => {
    expect(
      users({
        loading: false,
        error: null,
        records: [
          {
            user_id: 1,
            name: 'test',
            blocked: false,
            email: 'test@mail.com',
            last_login: '2016-09-27T10:54:48.864Z',
            logins_count: 1882
          },
          {
            user_id: 2,
            name: 'test_2',
            blocked: false,
            email: 'test2@mail.com',
            logins_count: 0
          }
        ],
        total: 0
      }, {
        type: constants.BLOCK_USER_FULFILLED,
        meta: {
          userId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            user_id: 1,
            name: 'test',
            blocked: true,
            email: 'test@mail.com',
            last_login: '2016-09-27T10:54:48.864Z',
            logins_count: 1882
          },
          {
            user_id: 2,
            name: 'test_2',
            blocked: false,
            email: 'test2@mail.com',
            logins_count: 0
          }
        ],
        total: 0
      }
    );
  });

  it('should handle UNBLOCK_USER_FULFILLED', () => {
    expect(
      users({
        loading: false,
        error: null,
        records: [
          {
            user_id: 1,
            name: 'test',
            blocked: true,
            email: 'test@mail.com',
            last_login: '2016-09-27T10:54:48.864Z',
            logins_count: 1882
          },
          {
            user_id: 2,
            name: 'test_2',
            blocked: false,
            email: 'test2@mail.com',
            logins_count: 0
          }
        ],
        total: 0
      }, {
        type: constants.UNBLOCK_USER_FULFILLED,
        meta: {
          userId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            user_id: 1,
            name: 'test',
            blocked: false,
            email: 'test@mail.com',
            last_login: '2016-09-27T10:54:48.864Z',
            logins_count: 1882
          },
          {
            user_id: 2,
            name: 'test_2',
            blocked: false,
            email: 'test2@mail.com',
            logins_count: 0
          }
        ],
        total: 0
      }
    );
  });

  it('should handle REMOVE_MULTIFACTOR_FULFILLED', () => {
    expect(
      users({
        loading: false,
        error: null,
        records: [
          {
            user_id: 1,
            name: 'test',
            blocked: true,
            email: 'test@mail.com',
            last_login: '2016-09-27T10:54:48.864Z',
            logins_count: 1882,
            multifactor: [ 'guardian' ]
          },
          {
            user_id: 2,
            name: 'test_2',
            blocked: false,
            email: 'test2@mail.com',
            logins_count: 0,
            multifactor: [ 'guardian' ]
          }
        ],
        total: 0
      }, {
        type: constants.REMOVE_MULTIFACTOR_FULFILLED,
        meta: {
          userId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            user_id: 1,
            name: 'test',
            blocked: true,
            email: 'test@mail.com',
            last_login: '2016-09-27T10:54:48.864Z',
            logins_count: 1882,
            multifactor: [ ]
          },
          {
            user_id: 2,
            name: 'test_2',
            blocked: false,
            email: 'test2@mail.com',
            logins_count: 0,
            multifactor: [ 'guardian' ]
          }
        ],
        total: 0
      }
    );
  });
});
