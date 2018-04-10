import axios from 'axios';
import { push } from 'react-router-redux';

import * as constants from '../constants';
import { fetchUserLogs } from './userLog';
import { fetchUserDevices } from './userDevice';
import { getAccessLevel } from './auth';

const addRequiredTextParam = (url, languageDictionary) => {
  languageDictionary = languageDictionary || {};
  if (languageDictionary.requiredErrorText)
    return `${url}?requiredErrorText=${encodeURIComponent(languageDictionary.requiredErrorText)}`;
  return url;
};

/*
 * Search for users.
 */
export function fetchUsers(search, reset = false, page = 0, filterBy, sort, onSuccess) {
  return (dispatch, getState) => {
    const { sortProperty, sortOrder, searchValue } = getState().users.toJS();
    const meta = { page, sortProperty, sortOrder, searchValue, onSuccess };

    meta.searchValue = reset ? '' : search || searchValue;
    if (sort) {
      meta.sortProperty = sort.property;
      meta.sortOrder = sort.order;
    }

    dispatch({
      type: constants.FETCH_USERS,
      payload: {
        promise: axios.get('/api/users', {
          params: {
            search: meta.searchValue,
            page,
            filterBy,
            sortOrder: meta.sortOrder,
            sortProperty: meta.sortProperty
          },
          responseType: 'json'
        })
      },
      meta
    });
  };
}

/*
 * Create a user.
 */
export function createUser(user, languageDictionary) {
  return (dispatch) => {
    dispatch({
      type: constants.CREATE_USER,
      meta: {
        user,
        onSuccess: () => {
          // Give indexing some time when we reload users.
          setTimeout(() => dispatch(fetchUsers()), 1000);
          dispatch(getAccessLevel());
        }
      },
      payload: {
        promise: axios.post(addRequiredTextParam('/api/users/', languageDictionary), user, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Show dialog to create a user.
 */
export function requestCreateUser(memberships) {
  return (dispatch, getState) => {
    const connections = getState().connections.get('records').toJS();
    dispatch({
      type: constants.REQUEST_CREATE_USER,
      payload: {
        connection: connections && connections.length && connections[0].name,
        memberships: memberships && memberships.length === 1 ? [ memberships[0] ] : [ ]
      }
    });
  };
}

/*
 * Cancel creating a user.
 */
export function cancelCreateUser() {
  return {
    type: constants.CANCEL_CREATE_USER
  };
}

/*
 * Create a user.
 */
export function changeFields(userId, user, languageDictionary) {
  return (dispatch) => {
    dispatch({
      type: constants.FIELDS_CHANGE,
      meta: {
        userId,
        user,
        onSuccess: () => {
          dispatch(fetchUser(userId));
        }
      },
      payload: {
        promise: axios.patch(addRequiredTextParam(`/api/users/${userId}`, languageDictionary), user, {
          responseType: 'json'
        })
      }
    });
  };
}


/*
 * Show dialog to create a user.
 */
export function requestFieldsChange(user) {
  return (dispatch) => {
    dispatch({
      type: constants.REQUEST_FIELDS_CHANGE,
      payload: {
        user
      }
    });
  };
}

/*
 * Cancel creating a user.
 */
export function cancelChangeFields() {
  return {
    type: constants.CANCEL_FIELDS_CHANGE
  };
}

/*
 * Fetch the user details.
 */
export function fetchUserDetail(userId, onSuccess) {
  return {
    type: constants.FETCH_USER,
    meta: {
      userId,
      onSuccess
    },
    payload: {
      promise: axios.get(`/api/users/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json'
      })
    }
  };
}

/*
 * Fetch the complete user object.
 */
export function fetchUser(userId) {
  return (dispatch) => {
    dispatch(fetchUserDetail(userId));
    dispatch(fetchUserLogs(userId));
    dispatch(fetchUserDevices(userId));
  };
}

/*
 * Get confirmation to remove MFA from a user.
 */
export function requestRemoveMultiFactor(user, provider) {
  return {
    type: constants.REQUEST_REMOVE_MULTIFACTOR,
    user,
    provider
  };
}

/*
 * Cancel the removal process.
 */
export function cancelRemoveMultiFactor() {
  return {
    type: constants.CANCEL_REMOVE_MULTIFACTOR
  };
}

/*
 * Remove multi factor from a user.
 */
export function removeMultiFactor() {
  return (dispatch, getState) => {
    const { user: {user_id}, provider } = getState().mfa.toJS();
    dispatch({
      type: constants.REMOVE_MULTIFACTOR,
      payload: {
        promise: axios.delete(`/api/users/${user_id}/multifactor`, provider)
      },
      meta: {
        userId: user_id,
        onSuccess: () => {
          dispatch(fetchUserDetail(user_id))
        }
      }
    });
  };
}

/*
 * Get confirmation to block a user.
 */
export function requestBlockUser(user) {
  return {
    type: constants.REQUEST_BLOCK_USER,
    user
  };
}

/*
 * Cancel blocking a user.
 */
export function cancelBlockUser() {
  return {
    type: constants.CANCEL_BLOCK_USER
  };
}

/*
 * Update the user details.
 */
export function updateUser(userId, data, onSuccess, languageDictionary) {
  return (dispatch) => {
    dispatch({
      type: constants.UPDATE_USER,
      meta: {
        userId,
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          dispatch(fetchUserDetail(userId));
        }
      },
      payload: {
        promise: axios.put(addRequiredTextParam(`/api/users/${userId}`, languageDictionary), data, {
          responseType: 'json'
        })
      }
    });
  };
}
/*
 * Block a user.
 */
export function blockUser() {
  return (dispatch, getState) => {
    const userId = getState().block.get('user').get('user_id');
    dispatch({
      type: constants.BLOCK_USER,
      payload: {
        promise: axios.put(`/api/users/${userId}/block`)
      },
      meta: {
        userId,
        onSuccess: () => {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}

/*
 * Get confirmation to unblock a user.
 */
export function requestUnblockUser(user) {
  return {
    type: constants.REQUEST_UNBLOCK_USER,
    user
  };
}

/*
 * Cancel unblocking a user.
 */
export function cancelUnblockUser() {
  return {
    type: constants.CANCEL_UNBLOCK_USER
  };
}

/*
 * Unblock a user.
 */
export function unblockUser() {
  return (dispatch, getState) => {
    const userId = getState().unblock.get('user').get('user_id');
    dispatch({
      type: constants.UNBLOCK_USER,
      payload: {
        promise: axios.put(`/api/users/${userId}/unblock`)
      },
      meta: {
        userId,
        onSuccess: () => {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}

/*
 * Get confirmation to delete a user.
 */
export function requestDeleteUser(user) {
  return {
    type: constants.REQUEST_DELETE_USER,
    user
  };
}

/*
 * Cancel the delete process.
 */
export function cancelDeleteUser() {
  return {
    type: constants.CANCEL_DELETE_USER
  };
}

/*
 * Delete user.
 */
export function deleteUser() {
  return (dispatch, getState) => {
    const { user: {user_id} } = getState().userDelete.toJS();
    dispatch({
      type: constants.DELETE_USER,
      payload: {
        promise: axios.delete(`/api/users/${user_id}`)
      },
      meta: {
        userId: user_id,
        onSuccess: () => {
          dispatch(push('/users'));
        }
      }
    });
  };
}

/*
 * Get confirmation to reset a password.
 */
export function requestPasswordReset(user, connection) {
  return {
    type: constants.REQUEST_PASSWORD_RESET,
    user,
    connection
  };
}

/*
 * Cancel the password reset process.
 */
export function cancelPasswordReset() {
  return {
    type: constants.CANCEL_PASSWORD_RESET
  };
}

/*
 * Reset password.
 */
export function resetPassword(application) {
  return (dispatch, getState) => {
    const { user: { user_id }, connection } = getState().passwordReset.toJS();
    dispatch({
      type: constants.PASSWORD_RESET,
      payload: {
        promise: axios.post(`/api/users/${user_id}/password-reset`, {
          connection,
          clientId: application.client
        })
      },
      meta: {
        userId: user_id
      }
    });
  };
}

/*
 * Get confirmation to change a password.
 */
export function requestPasswordChange(user, connection) {
  return {
    type: constants.REQUEST_PASSWORD_CHANGE,
    user,
    connection
  };
}

/*
 * Cancel the password change process.
 */
export function cancelPasswordChange() {
  return {
    type: constants.CANCEL_PASSWORD_CHANGE
  };
}

/*
 * Change password.
 */
export function changePassword(formData, languageDictionary) {
  return (dispatch, getState) => {
    const { user: { user_id }, connection } = getState().passwordChange.toJS();
    dispatch({
      type: constants.PASSWORD_CHANGE,
      payload: {
        promise: axios.put(addRequiredTextParam(`/api/users/${user_id}/change-password`, languageDictionary), {
          connection,
          password: formData.password,
          repeatPassword: formData.repeatPassword
        })
      },
      meta: {
        userId: user_id
      }
    });
  };
}

/*
 * Get confirmation to change a username.
 */
export function requestUsernameChange(user, connection, customField) {
  return {
    type: constants.REQUEST_USERNAME_CHANGE,
    user,
    connection,
    customField
  };
}

/*
 * Cancel the username change process.
 */
export function cancelUsernameChange() {
  return {
    type: constants.CANCEL_USERNAME_CHANGE
  };
}

/*
 * Change username.
 */
export function changeUsername(userId, data, languageDictionary) {
  return (dispatch, getState) => {
    const user = getState().user.get('record').toJS();
    user.username = data.username;
    dispatch({
      type: constants.USERNAME_CHANGE,
      meta: {
        user,
        onSuccess: () => {
          dispatch(fetchUserDetail(userId));
        }
      },
      payload: {
        promise: axios.put(addRequiredTextParam(`/api/users/${userId}/change-username`, languageDictionary),
          data, { responseType: 'json' })
      }
    });
  };
}

/*
 * Get confirmation to change a email.
 */
export function requestEmailChange(user, connection, customField) {
  return {
    type: constants.REQUEST_EMAIL_CHANGE,
    user,
    connection,
    customField
  };
}

/*
 * Cancel the email change process.
 */
export function cancelEmailChange() {
  return {
    type: constants.CANCEL_EMAIL_CHANGE
  };
}

/*
 * Change email.
 */
export function changeEmail(userId, data, languageDictionary) {
  return (dispatch) => {
    dispatch({
      type: constants.EMAIL_CHANGE,
      meta: {
        userId,
        user: data,
        onSuccess: () => {
          dispatch(fetchUserDetail(userId));
        }
      },
      payload: {
        promise: axios.put(addRequiredTextParam(`/api/users/${userId}/change-email`, languageDictionary),
          data, { responseType: 'json' })
      }
    });
  };
}

/*
 * Get confirmation to change a email.
 */
export function requestResendVerificationEmail(user, connection) {
  return {
    type: constants.REQUEST_RESEND_VERIFICATION_EMAIL,
    user,
    connection
  };
}

/*
 * Cancel the email change process.
 */
export function cancelResendVerificationEmail() {
  return {
    type: constants.CANCEL_RESEND_VERIFICATION_EMAIL
  };
}

/*
 * Resend verification email.
 */
export function resendVerificationEmail(userId) {
  return (dispatch) => {
    const data = { user_id: userId };
    dispatch({
      type: constants.RESEND_VERIFICATION_EMAIL,
      meta: {
        userId,
        onSuccess: () => {
          dispatch(fetchUserDetail(userId));
        }
      },
      payload: {
        promise: axios.post(`/api/users/${userId}/send-verification-email`, data, {
          responseType: 'json'
        })
      }
    });
  };
}
