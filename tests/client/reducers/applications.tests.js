import expect from 'expect';
import { applications } from '../../../client/reducers/applications';
import * as constants from '../../../client/constants';
import { fromJS } from "immutable";

const initialState = {
  loading: false,
  error: null,
  records: fromJS([])
};

describe('applications reducer', () => {
  it('should return the initial state', () => {
    expect(
      applications(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_APPLICATIONS_PENDING', () => {
    expect(
      applications(initialState, {
        type: constants.FETCH_APPLICATIONS_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: fromJS([])
      }
    );
  });

  it('should handle FETCH_APPLICATIONS_REJECTED', () => {
    expect(
      applications(initialState, {
        type: constants.FETCH_APPLICATIONS_REJECTED,
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
        records: fromJS([])
      }
    );
  });

  it('should handle FETCH_APPLICATIONS_FULFILLED', () => {
    expect(
      applications(initialState, {
        type: constants.FETCH_APPLICATIONS_FULFILLED,
        payload: {
          data: [
            {
              name: 'auth0-github-deploy',
              global: false,
              client_id: 'z4JBexbssw4o6mCRPRQWaxzqampwXULL'
            }
          ]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: fromJS([
          {
            name: 'auth0-github-deploy',
            global: false,
            client_id: 'z4JBexbssw4o6mCRPRQWaxzqampwXULL'
          }
        ])
      }
    );
  });
});
