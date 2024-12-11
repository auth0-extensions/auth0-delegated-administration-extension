import expect from 'expect';
import { scripts } from '../../../client/reducers/scripts';
import * as constants from '../../../client/constants';
import {fromJS} from "immutable";

describe('scripts reducer', () => {
  it('should handle FETCH_SCRIPT_PENDING', () => {
    expect(
      scripts({}, {
        type: constants.FETCH_SCRIPT_PENDING,
        meta: { name: 'settings' }
      }).toJSON()
    ).toEqual(
      {
        settings: fromJS({
          loading: true,
          error: null,
          script: null,
          token: null
        })
      }
    );
  });

  it('should handle FETCH_SCRIPT_REJECTED', () => {
    expect(
      scripts({}, {
        type: constants.FETCH_SCRIPT_REJECTED,
        meta: { name: 'settings' },
        errorData: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        }
      }).toJSON()
    ).toEqual(
      {
        settings: fromJS({
          loading: false,
          error: {
            type: 'TEST',
            message: 'ERROR',
            status: 500
          }
        })
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
        settings: fromJS({
          loading: false,
          script: 'function () { return true; }'
        })
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
        }
      }).toJSON()
    ).toEqual(
      {
        settings: fromJS({
          loading: true,
          script: 'function () { return true; }'
        })
      }
    );
  });

  it('should handle UPDATE_SCRIPT_REJECTED', () => {
    expect(
      scripts({}, {
        type: constants.UPDATE_SCRIPT_REJECTED,
        meta: { name: 'settings' },
        errorData: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        }
      }).toJSON()
    ).toEqual(
      {
        settings: fromJS({
          loading: false,
          error: {
            type: 'TEST',
            message: 'ERROR',
            status: 500
          }
        })
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
        settings: fromJS({
          loading: false
        })
      }
    );
  });
});
