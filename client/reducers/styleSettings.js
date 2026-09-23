import { fromJS } from 'immutable';
import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  useAlt: false,
  path: ''
};

export const styleSettings = createReducer(fromJS(initialState), {  
  [constants.TOGGLE_STYLE_SETTINGS]: (state, action) =>
    state.merge({
      useAlt: action.payload.useAlt,
      path: action.payload.path
    }),
  [constants.GET_STYLE_SETTINGS]: (state, action) =>
    state.merge({
      useAlt: action.payload.useAlt,
      path: action.payload.path
    })
});
