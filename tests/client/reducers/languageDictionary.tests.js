import expect from 'expect';
import _ from 'lodash';
import { languageDictionary } from '../../../client/reducers/languageDictionary';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {}
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
        record: {}
      }
    );
  });

  it('should handle FETCH_LANGUAGE_DICTIONARY_REJECTED', () => {
    expect(
      languageDictionary(initialState, {
        type: constants.FETCH_LANGUAGE_DICTIONARY_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: {
          message: 'ERROR',
          type: 'load_dictionary'
        },
        record: {}
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
          record: {
            confirmButtonText: 'some text',
            userTitle: 'User Title'
          }
        }
      );
    });

  });
});
