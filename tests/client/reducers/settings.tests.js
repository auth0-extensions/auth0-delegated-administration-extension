import expect from 'expect';
import { settings } from '../../../client/reducers/settings';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: { settings: { dict: { title: '', memberships: '' }, css: '' } }
};

describe('settings reducer', () => {
  it('should return the initial state', () => {
    expect(
      settings(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_SETTINGS_PENDING', () => {
    expect(
      settings(initialState, {
        type: constants.FETCH_SETTINGS_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: { settings: { dict: { title: '', memberships: '' }, css: '' } }
      }
    );
  });

  it('should handle FETCH_SETTINGS_REJECTED', () => {
    expect(
      settings(initialState, {
        type: constants.FETCH_SETTINGS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the connections: ERROR',
        record: { settings: { dict: { title: '', memberships: '' }, css: '' } }
      }
    );
  });

  it('should handle FETCH_SETTINGS_FULFILLED', () => {
    expect(
      settings(initialState, {
        type: constants.FETCH_SETTINGS_FULFILLED,
        payload: { data: { settings: { dict: { title: 'test', memberships: 'test1, test2' }, css: 'style.css' } } }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: { settings: { dict: { title: 'test', memberships: 'test1, test2' }, css: 'style.css' } }
      }
    );
  });
});
