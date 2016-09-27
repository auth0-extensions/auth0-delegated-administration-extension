import expect from 'expect';
import { userDelete } from '../../../client/reducers/userDelete';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  userName: null
};

describe('User Delete reducer', () => {
  it('should return the initial state', () => {
    expect(
      userDelete(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_DELETE_USER', () => {
    expect(
      userDelete(initialState, {
        type: constants.REQUEST_DELETE_USER,
        user: {
          user_id: 1,
          user_name: 'user_name'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        userId: 1,
        userName: 'user_name'
      }
    );
  });

  it('should handle REQUEST_DELETE_USER', () => {
    expect(
      userDelete(initialState, {
        type: constants.REQUEST_DELETE_USER,
        user: {
          user_id: 1,
          email: 'test@mail.com'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        userId: 1,
        userName: 'test@mail.com'
      }
    );
  });

  it('should handle CANCEL_DELETE_USER', () => {
    expect(
      userDelete(initialState, {
        type: constants.CANCEL_DELETE_USER
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle DELETE_USER_PENDING', () => {
    expect(
      userDelete(initialState, {
        type: constants.DELETE_USER_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        userId: null,
        userName: null
      }
    );
  });

  it('should handle DELETE_USER_REJECTED', () => {
    expect(
      userDelete(initialState, {
        type: constants.DELETE_USER_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: 'An error occured while deleting the user: ERROR',
        loading: false,
        requesting: false,
        userId: null,
        userName: null
      }
    );
  });

  it('should handle DELETE_USER_FULFILLED', () => {
    expect(
      userDelete(initialState, {
        type: constants.DELETE_USER_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
