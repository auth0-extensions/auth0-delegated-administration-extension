import expect from 'expect';
import { accessLevel } from '../../../client/reducers/accessLevel';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: { access_level: 0, memberships: [] }
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
        record: { access_level: 0, memberships: [] }
      }
    );
  });

  it('should handle FETCH_ACCESS_LEVEL_REJECTED', () => {
    expect(
      accessLevel(initialState, {
        type: constants.FETCH_ACCESS_LEVEL_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the settings: ERROR',
        record: { access_level: 0, memberships: [] }
      }
    );
  });

  it('should handle FETCH_ACCESS_LEVEL_FULFILLED', () => {
    expect(
      accessLevel(initialState, {
        type: constants.FETCH_ACCESS_LEVEL_FULFILLED,
        payload: { data: { access_level: 2, memberships: [ 'test1', 'test2' ] } }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: { access_level: 2, memberships: [ 'test1', 'test2' ] }
      }
    );
  });
});
