import expect from 'expect';
import { scripts } from '../../../client/reducers/scripts';
import * as constants from '../../../client/constants';

const initialState = {};

describe('scripts reducer', () => {
  it('should handle FETCH_SCRIPT_PENDING', () => {
    expect(
      scripts({}, {
        type: constants.FETCH_SCRIPT_PENDING,
        meta: { name: 'settings' }
      }).toJSON()
    ).toEqual(
      {
        settings: {
          loading: true,
          error: null,
          script: null
        }
      }
    );
  });

  it('should handle FETCH_SCRIPT_REJECTED', () => {
    expect(
      scripts({}, {
        type: constants.FETCH_SCRIPT_REJECTED,
        meta: { name: 'settings' },
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        settings: {
          loading: false,
          error: 'An error occured while loading the script: ERROR'
        }
      }
    );
  });

  it('should handle FETCH_SCRIPT_FULFILLED', () => {
    expect(
      scripts({}, {
        type: constants.FETCH_SCRIPT_FULFILLED,
        meta: { name: 'settings' },
        payload: {
          data: {
            script: 'function () { return true; }'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        settings: {
          loading: false,
          script: 'function () { return true; }'
        }
      }
    );
  });

  it('should handle UPDATE_SCRIPT_PENDING', () => {
    expect(
      scripts({}, {
        type: constants.UPDATE_SCRIPT_PENDING,
        meta: {
          name: 'settings',
          script: 'function () { return true; }'
        },
      }).toJSON()
    ).toEqual(
      {
        settings: {
          loading: true,
          script: 'function () { return true; }'
        }
      }
    );
  });

  it('should handle UPDATE_SCRIPT_REJECTED', () => {
    expect(
      scripts({}, {
        type: constants.UPDATE_SCRIPT_REJECTED,
        meta: { name: 'settings' },
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        settings: {
          loading: false,
          error: 'An error occured while saving the script: ERROR'
        }
      }
    );
  });

  it('should handle UPDATE_SCRIPT_FULFILLED', () => {
    expect(
      scripts({}, {
        type: constants.UPDATE_SCRIPT_FULFILLED,
        meta: { name: 'settings' },
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        settings: {
          loading: false
        }
      }
    );
  });
})