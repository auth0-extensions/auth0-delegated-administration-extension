import expect from 'expect';
import { userCreate } from '../../../client/reducers/userCreate';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  record: null,
  loading: false,
  validationErrors: { }
};

describe('User Create reducer', () => {
  it('should return the initial state', () => {
    expect(
      userCreate(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_CREATE_USER', () => {
    expect(
      userCreate(initialState, {
        type: constants.REQUEST_CREATE_USER,
        payload: {
          memberships: [ 'department_1', 'department_2' ],
          connection: 'connection'
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        record: {
          memberships: [ 'department_1', 'department_2' ],
          connection: 'connection'
        },
        loading: false,
        validationErrors: { }
      }
    );
  });

  it('should handle CANCEL_CREATE_USER', () => {
    expect(
      userCreate(initialState, {
        type: constants.CANCEL_CREATE_USER
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CREATE_USER_PENDING', () => {
    expect(
      userCreate(initialState, {
        type: constants.CREATE_USER_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        record: null,
        loading: true,
        validationErrors: { }
      }
    );
  });

  it('should handle CREATE_USER_REJECTED', () => {
    expect(
      userCreate(initialState, {
        type: constants.CREATE_USER_REJECTED,
        error: true,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: {
          message: 'ERROR',
          type: 'create_user'
        },
        record: null,
        loading: false,
        validationErrors: { }
      }
    );
  });

  it('should handle CREATE_USER_REJECTED', () => {
    expect(
      userCreate(initialState, {
        type: constants.CREATE_USER_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: {
          message: 'ERROR',
          type: 'create_user'
        },
        record: null,
        loading: false,
        validationErrors: { }
      }
    );
  });

  it('should handle CREATE_USER_FULFILLED', () => {
    expect(
      userCreate(initialState, {
        type: constants.CREATE_USER_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
