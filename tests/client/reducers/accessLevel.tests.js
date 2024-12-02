import expect from 'expect';
import { accessLevel } from '../../../client/reducers/accessLevel';
import * as constants from '../../../client/constants';
import { fromJS } from "immutable";

const initialState = {
  loading: false,
  error: null,
  record: fromJS({ role: 0, memberships: [], createMemberships: false })
};

describe('accessLevel reducer', () => {
  it('should return the initial state', () => {
    expect(
      accessLevel(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_ACCESS_LEVEL_PENDING', () => {
    expect(
      accessLevel(initialState, {
        type: constants.FETCH_ACCESS_LEVEL_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: fromJS({ role: 0, memberships: [], createMemberships: false })
      }
    );
  });

  it('should handle FETCH_ACCESS_LEVEL_REJECTED', () => {
    expect(
      accessLevel(initialState, {
        type: constants.FETCH_ACCESS_LEVEL_REJECTED,
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
          message: 'ERROR',
          type: 'TEST',
          status: 500
        },
        record: fromJS({ role: 2, memberships: [], createMemberships: false })
      }
    );
  });

  it('should handle FETCH_ACCESS_LEVEL_FULFILLED', () => {
    expect(
      accessLevel(initialState, {
        type: constants.FETCH_ACCESS_LEVEL_FULFILLED,
        payload: { data: { role: 2, memberships: [ 'test1', 'test2' ] } }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: fromJS({ role: 2, memberships: [ 'test1', 'test2' ] })
      }
    );
  });
});
