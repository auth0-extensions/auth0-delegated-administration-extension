import expect from 'expect';
import _ from 'lodash';
import { languageDictionary } from '../../../client/reducers/languageDictionary';
import * as constants from '../../../client/constants';
import {fromJS} from "immutable";

const initialState = {
  loading: false,
  error: null,
  record: fromJS({})
};

describe('languageDictionary reducer', () => {
  it('should return the initial state', () => {
    expect(
      languageDictionary(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_LANGUAGE_DICTIONARY_PENDING', () => {
    expect(
      languageDictionary(initialState, {
        type: constants.FETCH_LANGUAGE_DICTIONARY_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: fromJS({})
      }
    );
  });

  it('should handle FETCH_LANGUAGE_DICTIONARY_REJECTED', () => {
    expect(
      languageDictionary(initialState, {
        type: constants.FETCH_LANGUAGE_DICTIONARY_REJECTED,
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
        record: fromJS({})
      }
    );
  });

  describe('should handle FETCH_LANGUAGE_DICTIONARY_FULFILLED', () => {
    it('basic', () => {
      expect(
        languageDictionary(initialState, {
          type: constants.FETCH_LANGUAGE_DICTIONARY_FULFILLED,
          payload: {
            data: {
              confirmButtonText: 'some text',
              userTitle: 'User Title'
            }
          }
        }).toJSON()
      ).toEqual(
        {
          loading: false,
          error: null,
          record: fromJS({
            confirmButtonText: 'some text',
            userTitle: 'User Title'
          })
        }
      );
    });

  });
});
