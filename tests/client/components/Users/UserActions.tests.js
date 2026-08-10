import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import UserActions from '../../../../client/components/Users/UserActions';

describe('#Client-Components-UserActions', () => {
  let calls = [];
  const track = (name) => () => { calls.push(name); return name; };

  const blockUser = track('blockUser');
  const changeEmail = track('changeEmail');
  const changePassword = track('changePassword');
  const deleteUser = track('deleteUser');
  const changeFields = track('changeFields');
  const removeMfa = track('removeMfa');
  const resendVerificationEmail = track('resendVerificationEmail');
  const resetPassword = track('resetPassword');
  const changeUsername = track('changeUsername');
  const unblockUser = track('unblockUser');
  const removeBlockedIPs = track('removeBlockedIPs');

  const renderComponent = (user, languageDictionary, userFields = [{ edit: true }]) => {
    return render(
      <UserActions
        blockUser={blockUser}
        changeEmail={changeEmail}
        changePassword={changePassword}
        changeUsername={changeUsername}
        databaseConnections={fromJS(['connA'])}
        deleteUser={deleteUser}
        changeFields={changeFields}
        removeMfa={removeMfa}
        resendVerificationEmail={resendVerificationEmail}
        resetPassword={resetPassword}
        unblockUser={unblockUser}
        removeBlockedIPs={removeBlockedIPs}
        user={fromJS(user)}
        userFields={userFields}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
    calls = [];
  });

  const checkMenuItems = (queries, targets) => {
    const items = queries.getAllByRole('menuitem');
    const menuLabels = items.map(item => item.textContent.trim()).filter(Boolean);
    const targetLabels = Object.keys(targets);

    expect(menuLabels).to.have.members(targetLabels);
    expect(menuLabels.length).to.equal(targetLabels.length);

    items.forEach(item => {
      const label = item.textContent.trim();
      calls = [];
      fireEvent.click(item);
      expect(calls).to.deep.equal([targets[label]]);
    });
  };

  it('should render', () => {
    const queries = renderComponent({ username: 'bill', multifactor: ['guardian'] });
    const targets = {
      "Block User": blockUser(),
      "Change Email": changeEmail(),
      "Change Password": changePassword(),
      "Delete User": deleteUser(),
      "Change Profile": changeFields(),
      "Remove MFA": removeMfa(),
      "Resend Verification Email": resendVerificationEmail(),
      "Reset Password": resetPassword(),
      "Change Username": changeUsername()
    };

    checkMenuItems(queries, targets);
  });

  it('should render unblock', () => {
    const queries = renderComponent({ username: 'bill', multifactor: ['guardian'], blocked: true });
    const targets = {
      "Unblock User": unblockUser(),
      "Change Email": changeEmail(),
      "Change Password": changePassword(),
      "Delete User": deleteUser(),
      "Change Profile": changeFields(),
      "Remove MFA": removeMfa(),
      "Resend Verification Email": resendVerificationEmail(),
      "Reset Password": resetPassword(),
      "Change Username": changeUsername()
    };

    checkMenuItems(queries, targets);
  });

  it('should render removeBlocks', () => {
    const queries = renderComponent({ username: 'bill', multifactor: ['guardian'], blocked_for: [ 'some stuff' ] });
    const targets = {
      "Block User": blockUser(),
      "Unblock for all IPs": removeBlockedIPs(),
      "Change Email": changeEmail(),
      "Change Password": changePassword(),
      "Delete User": deleteUser(),
      "Change Profile": changeFields(),
      "Remove MFA": removeMfa(),
      "Resend Verification Email": resendVerificationEmail(),
      "Reset Password": resetPassword(),
      "Change Username": changeUsername()
    };

    checkMenuItems(queries, targets);
  });

  it('should not render change password, email and username, if those fields are disabled in userFields', () => {
    const userFields = [
      { property: 'password', edit: false },
      { property: 'email', edit: false },
      { property: 'username', edit: false },
      { property: 'delete', edit: false }
    ];
    const queries = renderComponent({ username: 'bill' }, {}, userFields);
    const targets = {
      "Block User": blockUser(),
      "Resend Verification Email": resendVerificationEmail()
    };

    checkMenuItems(queries, targets);
  });

  it('should not render reset password, if disabled in userFields', () => {
    const userFields = [
      { property: 'password', edit: false },
      { property: 'resetPassword', edit: true }
    ];
    const queries = renderComponent({ username: 'bill' }, {}, userFields);
    const targets = {
      "Block User": blockUser(),
      "Change Email": changeEmail(),
      "Change Username": changeUsername(),
      "Reset Password": resetPassword(),
      "Delete User": deleteUser(),
      "Resend Verification Email": resendVerificationEmail()
    };

    checkMenuItems(queries, targets);
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      blockUserMenuItemText: 'blockUser',
      changeEmailMenuItemText: 'changeEmail',
      changePasswordMenuItemText: 'changePassword',
      deleteUserMenuItemText: 'deleteUser',
      changeFieldsMenuItemText: 'changeFields',
      removeMfaMenuItemText: 'removeMfa',
      resendVerificationEmailMenuItemText: 'resendVerificationEmail',
      resetPasswordMenuItemText: 'resetPassword',
      changeUsernameMenuItemText: 'changeUsername',
      unblockUserMenuItemText: 'unblockUser'
    };
    const queries = renderComponent({ username: 'bill', multifactor: ['guardian'] }, languageDictionary);
    const targets = {
      "blockUser": blockUser(),
      "changeEmail": changeEmail(),
      "changePassword": changePassword(),
      "deleteUser": deleteUser(),
      "changeFields": changeFields(),
      "removeMfa": removeMfa(),
      "resendVerificationEmail": resendVerificationEmail(),
      "resetPassword": resetPassword(),
      "changeUsername": changeUsername()
    };

    checkMenuItems(queries, targets);
  });

  it('should render based on languageDictionary unblock', () => {
    const languageDictionary = {
      blockUserMenuItemText: 'blockUser',
      changeEmailMenuItemText: 'changeEmail',
      changePasswordMenuItemText: 'changePassword',
      deleteUserMenuItemText: 'deleteUser',
      changeFieldsMenuItemText: 'changeFields',
      removeMfaMenuItemText: 'removeMfa',
      resendVerificationEmailMenuItemText: 'resendVerificationEmail',
      resetPasswordMenuItemText: 'resetPassword',
      changeUsernameMenuItemText: 'changeUsername',
      unblockUserMenuItemText: 'unblockUser'
    };
    const queries = renderComponent({
      username: 'bill',
      multifactor: ['guardian'],
      blocked: true
    }, languageDictionary);
    const targets = {
      "unblockUser": unblockUser(),
      "changeEmail": changeEmail(),
      "changePassword": changePassword(),
      "deleteUser": deleteUser(),
      "changeFields": changeFields(),
      "removeMfa": removeMfa(),
      "resendVerificationEmail": resendVerificationEmail(),
      "resetPassword": resetPassword(),
      "changeUsername": changeUsername()
    };

    checkMenuItems(queries, targets);
  });

  it('should render based on languageDictionary but missing menu items', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const queries = renderComponent({ username: 'bill', multifactor: ['guardian'] }, languageDictionary);
    const targets = {
      "Block User": blockUser(),
      "Change Email": changeEmail(),
      "Change Password": changePassword(),
      "Delete User": deleteUser(),
      "Change Profile": changeFields(),
      "Remove MFA": removeMfa(),
      "Resend Verification Email": resendVerificationEmail(),
      "Reset Password": resetPassword(),
      "Change Username": changeUsername()
    };

    checkMenuItems(queries, targets);
  });

  it('should render based on languageDictionary but missing menu items unblock', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const queries = renderComponent({
      username: 'bill',
      multifactor: ['guardian'],
      blocked: true
    }, languageDictionary);
    const targets = {
      "Unblock User": unblockUser(),
      "Change Email": changeEmail(),
      "Change Password": changePassword(),
      "Delete User": deleteUser(),
      "Change Profile": changeFields(),
      "Remove MFA": removeMfa(),
      "Resend Verification Email": resendVerificationEmail(),
      "Reset Password": resetPassword(),
      "Change Username": changeUsername()
    };

    checkMenuItems(queries, targets);
  });

});
