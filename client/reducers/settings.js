import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { settings: { title: '', css: '' } }
};

export const settings = createReducer(fromJS(initialState), {
  [constants.FETCH_SETTINGS]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_SETTINGS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the connections: ${action.errorMessage}`
    }),
  [constants.FETCH_SETTINGS_FULFILLED]: (state, action) => {
    const data = fromJS(action.payload.data);
    const settings = data.get('settings');
    const title = settings.get('title');
    if(title !== '') document.title = title;
    const css = settings.get('css');
    if (css !== '') {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.id = 'custom_css';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = css;
      link.media = 'all';
      head.appendChild(link);
    }
    return state.merge({
      loading: false,
      error: null,
      record: data
    });
  }
});
