import expect from 'expect';
import { unblock } from '../../../client/reducers/unblock';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};

describe('unblock reducer', () => {
  it('should return the initial state', () => {
    expect(
      unblock(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_UNBLOCK_USER', () => {
    expect(
      unblock(initialState, {
        type: constants.REQUEST_UNBLOCK_USER,
        user: {
          user_id: 'user_1',
          user_name: 'user'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_1',
          user_name: 'user'
        }
      }
    );
  });

  it('should handle REQUEST_UNBLOCK_USER', () => {
    expect(
      unblock(initialState, {
        type: constants.REQUEST_UNBLOCK_USER,
        user: {
          user_id: 'user_1',
          email: 'test@mail.com'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_1',
          email: 'test@mail.com'
        }
      }
    );
  });

  it('should handle CANCEL_UNBLOCK_USER', () => {
    expect(
      unblock(initialState, {
        type: constants.CANCEL_UNBLOCK_USER
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle UNBLOCK_USER_PENDING', () => {
    expect(
      unblock(initialState, {
        type: constants.UNBLOCK_USER_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        user: null
      }
    );
  });

  it('should handle UNBLOCK_USER_REJECTED', () => {
    expect(
      unblock(initialState, {
        type: constants.UNBLOCK_USER_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: {
          message: 'ERROR',
          type: 'unblock_user'
        },
        loading: false,
        requesting: false,
        user: null
      }
    );
  });

  it('should handle UNBLOCK_USER_FULFILLED', () => {
    expect(
      unblock(initialState, {
        type: constants.UNBLOCK_USER_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
