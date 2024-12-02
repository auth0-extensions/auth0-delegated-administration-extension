import expect from 'expect';
import { block } from '../../../client/reducers/block';
import * as constants from '../../../client/constants';
import {fromJS} from "immutable";

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};

describe('block reducer', () => {
  it('should return the initial state', () => {
    expect(
      block(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

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
        user: fromJS({
          user_id: 1,
          user_name: 'test@mail.com'
        }),
        requesting: true
      }
    );
  });

  it('should handle REQUEST_BLOCK_USER 2', () => {
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
        user: fromJS({
          user_id: 1,
          email: 'test@mail.com'
        }),
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
        user: null
      }
    );
  });

  it('should handle BLOCK_USER_REJECTED', () => {
    expect(
      block(initialState, {
        type: constants.BLOCK_USER_REJECTED,
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
        requesting: false,
        user: null
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
});
