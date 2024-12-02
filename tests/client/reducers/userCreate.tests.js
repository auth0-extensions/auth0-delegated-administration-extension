import expect from 'expect';
import { userCreate } from '../../../client/reducers/userCreate';
import * as constants from '../../../client/constants';
import {fromJS} from "immutable";

const initialState = {
  error: null,
  record: null,
  loading: false,
  validationErrors: fromJS({})
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
        validationErrors: fromJS({})
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
        validationErrors: fromJS({})
      }
    );
  });

  it('should handle CREATE_USER_REJECTED', () => {
    expect(
      userCreate(initialState, {
        type: constants.CREATE_USER_REJECTED,
        error: true,
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
        record: null,
        loading: false,
        validationErrors: fromJS({})
      }
    );
  });

  it('should handle CREATE_USER_REJECTED', () => {
    expect(
      userCreate(initialState, {
        type: constants.CREATE_USER_REJECTED,
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
        record: null,
        loading: false,
        validationErrors: fromJS({})
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
