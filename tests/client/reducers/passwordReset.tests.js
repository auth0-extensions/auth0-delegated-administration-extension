import expect from 'expect';
import { passwordReset } from '../../../client/reducers/passwordReset';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  connection: null
};

describe('Password Reset reducer', () => {
  it('should return the initial state', () => {
    expect(
      passwordReset(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_PASSWORD_RESET', () => {
    expect(
      passwordReset(initialState, {
        type: constants.REQUEST_PASSWORD_RESET,
        user: {
          user_id: 'user_1',
          email: 'test@mail.com'
        },
        connection: 'connection'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_1',
          email: 'test@mail.com'
        },
        connection: 'connection'
      }
    );
  });

  it('should handle REQUEST_PASSWORD_RESET', () => {
    expect(
      passwordReset(initialState, {
        type: constants.REQUEST_PASSWORD_RESET,
        user: {
          user_id: 'user_1',
          user_name: 'user_name',
          email: 'test@mail.com'
        },
        connection: 'connection'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_1',
          user_name: 'user_name',
          email: 'test@mail.com'
        },
        connection: 'connection'
      }
    );
  });

  it('should handle REQUEST_PASSWORD_RESET', () => {
    expect(
      passwordReset(initialState, {
        type: constants.REQUEST_PASSWORD_RESET,
        user: {
          user_id: 'user_1',
          name: 'user_name',
          email: 'test@mail.com'
        },
        connection: 'connection'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_1',
          name: 'user_name',
          email: 'test@mail.com'
        },
        connection: 'connection'
      }
    );
  });

  it('should handle CANCEL_PASSWORD_RESET', () => {
    expect(
      passwordReset(initialState, {
        type: constants.CANCEL_PASSWORD_RESET
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle PASSWORD_RESET_PENDING', () => {
    expect(
      passwordReset(initialState, {
        type: constants.PASSWORD_RESET_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        user: null,
        connection: null
      }
    );
  });

  it('should handle PASSWORD_RESET_REJECTED', () => {
    expect(
      passwordReset(initialState, {
        type: constants.PASSWORD_RESET_REJECTED,
        errorData: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        }
      }).toJSON()
    ).toEqual(
      {
        error: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        },
        loading: false,
        requesting: false,
        user: null,
        connection: null
      }
    );
  });

  it('should handle PASSWORD_RESET_FULFILLED', () => {
    expect(
      passwordReset(initialState, {
        type: constants.PASSWORD_RESET_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
