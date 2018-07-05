import expect from 'expect';
import { mfa } from '../../../client/reducers/mfa';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  provider: null
};

describe('mfa reducer', () => {
  it('should return the initial state', () => {
    expect(
      mfa(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_REMOVE_MULTIFACTOR', () => {
    expect(
      mfa(initialState, {
        type: constants.REQUEST_REMOVE_MULTIFACTOR,
        user: {
          user_id: 'user_1',
          user_name: 'user',
          email: 'test@mail.com'
        },
        provider: {}
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_1',
          user_name: 'user',
          email: 'test@mail.com'
        },
        provider: {}
      }
    );
  });

  it('should handle REQUEST_REMOVE_MULTIFACTOR', () => {
    expect(
      mfa(initialState, {
        type: constants.REQUEST_REMOVE_MULTIFACTOR,
        user: {
          user_id: 'user_1',
          email: 'test@mail.com'
        },
        provider: {}
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
        provider: {}
      }
    );
  });

  it('should handle CANCEL_REMOVE_MULTIFACTOR', () => {
    expect(
      mfa(initialState, {
        type: constants.CANCEL_REMOVE_MULTIFACTOR
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REMOVE_MULTIFACTOR_PENDING', () => {
    expect(
      mfa(initialState, {
        type: constants.REMOVE_MULTIFACTOR_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        user: null,
        provider: null
      }
    );
  });

  it('should handle REMOVE_MULTIFACTOR_REJECTED', () => {
    expect(
      mfa(initialState, {
        type: constants.REMOVE_MULTIFACTOR_REJECTED,
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
        provider: null
      }
    );
  });

  it('should handle REMOVE_MULTIFACTOR_FULFILLED', () => {
    expect(
      mfa(initialState, {
        type: constants.REMOVE_MULTIFACTOR_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
