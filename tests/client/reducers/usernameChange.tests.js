import expect from 'expect';
import { usernameChange } from '../../../client/reducers/usernameChange';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  userName: null,
  userEmail: null,
  userNameToChange: null,
  customField: null,
  connection: null
};

describe('User Name Change reducer', () => {
  it('should return the initial state', () => {
    expect(
      usernameChange(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_USERNAME_CHANGE', () => {
    expect(
      usernameChange(initialState, {
        type: constants.REQUEST_USERNAME_CHANGE,
        user: {
          user_id: 1,
          name: 'test',
          username: 'user_name',
          email: 'test@mail.ru'
        },
        connection: 'connection',
        customField: { property: 'prop' }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        userId: 1,
        userName: 'test',
        userEmail: 'test@mail.ru',
        userNameToChange: 'user_name',
        connection: 'connection',
        customField: { property: 'prop' }
      }
    );
  });

  it('should handle REQUEST_USERNAME_CHANGE', () => {
    expect(
      usernameChange(initialState, {
        type: constants.REQUEST_USERNAME_CHANGE,
        user: {
          user_id: 1,
          username: 'user_name',
          email: 'test@mail.ru'
        },
        connection: 'connection'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        userId: 1,
        userName: 'user_name',
        userEmail: 'test@mail.ru',
        userNameToChange: 'user_name',
        connection: 'connection',
        customField: undefined
      }
    );
  });

  it('should handle REQUEST_USERNAME_CHANGE', () => {
    expect(
      usernameChange(initialState, {
        type: constants.REQUEST_USERNAME_CHANGE,
        user: {
          user_id: 1,
          email: 'test@mail.ru'
        },
        connection: 'connection'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        userId: 1,
        userName: 'test@mail.ru',
        userEmail: 'test@mail.ru',
        userNameToChange: undefined,
        connection: 'connection',
        customField: undefined
      }
    );
  });

  it('should handle CANCEL_USERNAME_CHANGE', () => {
    expect(
      usernameChange(initialState, {
        type: constants.CANCEL_USERNAME_CHANGE
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle USERNAME_CHANGE_PENDING', () => {
    expect(
      usernameChange(initialState, {
        type: constants.USERNAME_CHANGE_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        userId: null,
        userName: null,
        userEmail: null,
        userNameToChange: null,
        connection: null,
        customField: null
      }
    );
  });

  it('should handle USERNAME_CHANGE_REJECTED', () => {
    expect(
      usernameChange(initialState, {
        type: constants.USERNAME_CHANGE_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: 'An error occurred while changing the username: ERROR',
        loading: false,
        requesting: false,
        userId: null,
        userName: null,
        userEmail: null,
        userNameToChange: null,
        connection: null,
        customField: null
      }
    );
  });

  it('should handle USERNAME_CHANGE_FULFILLED', () => {
    expect(
      usernameChange(initialState, {
        type: constants.USERNAME_CHANGE_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
