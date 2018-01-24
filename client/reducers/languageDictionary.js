import { fromJS } from 'immutable';
import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { }
};

export const languageDictionary = createReducer(fromJS(initialState), { // eslint-disable-line
// import/prefer-default-export
  [constants.FETCH_LANGUAGE_DICTIONARY_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true,
      error: null
    }),
  [constants.FETCH_LANGUAGE_DICTIONARY_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the language dictionary: ${action.errorMessage}`
    }),
  [constants.FETCH_LANGUAGE_DICTIONARY_FULFILLED]: (state, action) => {
    const data = action.payload.data;
    return state.merge({
      loading: false,
      error: null,
      record: fromJS(data)
    });
  }

});
