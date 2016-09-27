import expect from 'expect';
import { block } from '../../../client/reducers/block';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  userName: null
};

describe('block reducer', () => {
  it('should return the initial state', () => {
    expect(
      block(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  })

  it('should handle REQUEST_BLOCK_USER', () => {
    expect(
      block(initialState, {
        type: constants.REQUEST_BLOCK_USER,
        user: {
          user_id: 1,
          user_name: 'test@mail.com'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        userId: 1,
        userName: 'test@mail.com',
        requesting: true
      }
    );
  });

  it('should handle REQUEST_BLOCK_USER', () => {
    expect(
      block(initialState, {
        type: constants.REQUEST_BLOCK_USER,
        user: {
          user_id: 1,
          email: 'test@mail.com'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        userId: 1,
        userName: 'test@mail.com',
        requesting: true
      }
    );
  });

  it('should handle CANCEL_BLOCK_USER', () => {
    expect(
      block(initialState, {
        type: constants.CANCEL_BLOCK_USER
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle BLOCK_USER_PENDING', () => {
    expect(
      block(initialState, {
        type: constants.BLOCK_USER_PENDING
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

  it('should handle BLOCK_USER_REJECTED', () => {
    expect(
      block(initialState, {
        type: constants.BLOCK_USER_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while blocking the user: ERROR',
        requesting: false,
        userId: null,
        userName: null
      }
    );
  });

  it('should handle BLOCK_USER_FULFILLED', () => {
    expect(
      block(initialState, {
        type: constants.BLOCK_USER_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
})