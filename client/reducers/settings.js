import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { settings: { dict: { title: '', memberships: '' }, userFields: [], css: '' } }
};

export const settings = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_SETTINGS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_SETTINGS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the connections: ${action.errorMessage}`
    }),
  [constants.FETCH_SETTINGS_FULFILLED]: (state, action) => {
    const data = action.payload.data;
    if (data.settings.userFields) {
      data.settings.userFields.forEach((field) => {
        if (field.display &&
          typeof field.display === 'string' &&
          field.display.startsWith("function"))
        // TODO: this is scary => what else can we do?
          field.display = eval(`(${field.display})`);
      });
    }
    return state.merge({
      loading: false,
      error: null,
      record: fromJS(data)
    });
  }

});
