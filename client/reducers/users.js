import moment from 'moment';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: [],
  total: 0,
  currentPage: 1,
  pages: 1 
};

export const users = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_USERS_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      loading: true,
      records: action.meta.page === 0 ? [] : state.get('records')
    }),
  [constants.FETCH_USERS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while retrieving list of users: ${action.errorMessage}`
    }),
  [constants.FETCH_USERS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      total: data.total,
      pages: Math.ceil(data.total / 100),
      nextPage: action.meta.page + 1,
      records: fromJS(data.users.map(user => ({
        ...user,
        last_login_relative: user.last_login ? moment(user.last_login).fromNow() : 'Never'
      })))
    });
  },
  [constants.BLOCK_USER_FULFILLED]: (state, action) =>
    state.updateIn(
      [ 'records', state.get('records').findIndex(p => p.get('user_id') === action.meta.userId), 'blocked' ], () => true
    ),
  [constants.UNBLOCK_USER_FULFILLED]: (state, action) =>
    state.updateIn(
      [ 'records', state.get('records').findIndex(p => p.get('user_id') === action.meta.userId), 'blocked' ], () => false
    ),
  [constants.REMOVE_MULTIFACTOR_FULFILLED]: (state, action) =>
    state.updateIn(
      [ 'records', state.get('records').findIndex(p => p.get('user_id') === action.meta.userId), 'multifactor' ], (multifactor) => multifactor.splice(0, 1)
    )
});
