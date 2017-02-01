import expect from 'expect';
import { passwordChange } from '../../../client/reducers/passwordChange';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  userName: null,
  userEmail: null,
  connection: null
};

describe('Password Change reducer', () => {
  it('should return the initial state', () => {
    expect(
      passwordChange(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_PASSWORD_CHANGE', () => {
    expect(
      passwordChange(initialState, {
        type: constants.REQUEST_PASSWORD_CHANGE,
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
        userId: 'user_1',
        userName: 'user_name',
        userEmail: 'test@mail.com',
        connection: 'connection'
      }
    );
  });

  it('should handle REQUEST_PASSWORD_CHANGE', () => {
    expect(
      passwordChange(initialState, {
        type: constants.REQUEST_PASSWORD_CHANGE,
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
        userId: 'user_1',
        userName: 'user_name',
        userEmail: 'test@mail.com',
        connection: 'connection'
      }
    );
  });

  it('should handle REQUEST_PASSWORD_CHANGE', () => {
    expect(
      passwordChange(initialState, {
        type: constants.REQUEST_PASSWORD_CHANGE,
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
        userId: 'user_1',
        userName: 'test@mail.com',
        userEmail: 'test@mail.com',
        connection: 'connection'
      }
    );
  });

  it('should handle CANCEL_PASSWORD_CHANGE', () => {
    expect(
      passwordChange(initialState, {
        type: constants.CANCEL_PASSWORD_CHANGE
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle PASSWORD_CHANGE_PENDING', () => {
    expect(
      passwordChange(initialState, {
        type: constants.PASSWORD_CHANGE_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        userId: null,
        userName: null,
        userEmail: null,
        connection: null
      }
    );
  });

  it('should handle PASSWORD_CHANGE_REJECTED', () => {
    expect(
      passwordChange(initialState, {
        type: constants.PASSWORD_CHANGE_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: 'An error occured while changing the password: ERROR',
        loading: false,
        requesting: false,
        userId: null,
        userName: null,
        userEmail: null,
        connection: null
      }
    );
  });

  it('should handle PASSWORD_CHANGE_FULFILLED', () => {
    expect(
      passwordChange(initialState, {
        type: constants.PASSWORD_CHANGE_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
