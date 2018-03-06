import { fromJS } from 'immutable';
import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  useAlt: false,
  path: ''
};

export const styleSettings = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.TOGGLE_STYLE_SETTINGS]: (state, action) =>
    state.merge({
      useAlt: action.payload.useAlt,
      path: action.payload.path
    })
});
