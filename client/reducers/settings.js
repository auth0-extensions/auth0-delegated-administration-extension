import { fromJS } from 'immutable';
import _ from 'lodash';
import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { settings: { dict: { title: '', memberships: '' }, userFields: [], css: '' } }
};

const parseDisplay = (property, displayAttribute, display) => {
  if (display &&
    _.isString(display) &&
    display.startsWith('function')) {
    try {
      // TODO: this is scary => what else can we do?
      display = eval(`(${display})`);
    } catch (error) {
      console.error(`The ${displayAttribute} function for field ${property} throws an error`, error);
    }
  }

  return display;
};

const parseOptions = (options) => {
  // Parse options
  if (_.isArray(options)) {
    options = options.map((option) => {
      if (_.isString(option)) {
        return { label: option, value: option };
      } else if (_.isObject(option) && _.has(option, 'label') && _.has(option, 'value')) {
        return option;
      }

      return { label: 'Error', value: '' };
    });
  }

  return options;
};

const parseFieldSection = (property, sectionInfo, sectionName) => {
  if (sectionInfo && _.isObject(sectionInfo)) {
    if (sectionInfo.display) sectionInfo.display = parseDisplay(property, `${sectionName}.display`, sectionInfo.display);
    if (sectionInfo.options) sectionInfo.options = parseOptions(sectionInfo.options);
  }
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
        parseFieldSection(field.property, field, 'userField');
        parseFieldSection(field.property, field.edit, 'userField.edit');
        parseFieldSection(field.property, field.create, 'userField.create');
        parseFieldSection(field.property, field.search, 'userField.search');
      });
    }
    return state.merge({
      loading: false,
      error: null,
      record: fromJS(data)
    });
  }

});
