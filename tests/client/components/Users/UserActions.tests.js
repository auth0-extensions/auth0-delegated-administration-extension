import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import UserActions from '../../../../client/components/Users/UserActions';

describe('#Client-Components-UserActions', () => {
  const blockUser = () => 'blockUser';
  const changeEmail = () => 'changeEmail';
  const changePassword = () => 'changePassword';
  const deleteUser = () => 'deleteUser';
  const changeFields = () => 'changeFields';
  const removeMfa = () => 'removeMfa';
  const resendVerificationEmail = () => 'resendVerificationEmail';
  const resetPassword = () => 'resetPassword';
  const changeUsername = () => 'changeUsername';
  const unblockUser = () => 'unblockUser';

  const renderComponent = (user, languageDictionary) => {
    return shallow(
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
        user={fromJS(user)}
        userFields={[
          {
            edit: true
          }
        ]}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  const addChildTextToString = (children) => {
    if (children.length === 1) {
      return children.valueOf(0).text();
    }

    let text = '';
    children.forEach(child => text += addChildTextToString(child));
    return text;
  };

  const checkMenuItems = (elements, targets) => {
    expect(elements.length).to.equal(Object.keys(targets).length);
    Object.keys(targets).forEach(targetStr => {
      let nodes = elements.filterWhere(element => {
        const onClickVal = element.prop('onClick');
        const onClickStr = onClickVal.toString();
        return onClickStr.indexOf(targets[targetStr]) >= 0;
      }).children();
      expect(addChildTextToString(nodes)).to.equal(targetStr);
    });
  };

  it('should render', () => {
    const Component = renderComponent({ username: 'bill', multifactor: ['guardian'] });
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

    expect(Component.length).to.be.greaterThan(0);
    const menuItems = Component.find('MenuItem');
    checkMenuItems(menuItems, targets);
  });

  it('should render unblock', () => {
    const Component = renderComponent({ username: 'bill', multifactor: ['guardian'], blocked: true });
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

    expect(Component.length).to.be.greaterThan(0);
    const menuItems = Component.find('MenuItem');
    checkMenuItems(menuItems, targets);
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
    const Component = renderComponent({ username: 'bill', multifactor: ['guardian'] }, languageDictionary);
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

    expect(Component.length).to.be.greaterThan(0);
    const menuItems = Component.find('MenuItem');
    checkMenuItems(menuItems, targets);
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
    const Component = renderComponent({
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

    expect(Component.length).to.be.greaterThan(0);
    const menuItems = Component.find('MenuItem');
    checkMenuItems(menuItems, targets);
  });

  it('should render based on languageDictionary but missing menu items', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const Component = renderComponent({ username: 'bill', multifactor: ['guardian'] }, languageDictionary);
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

    expect(Component.length).to.be.greaterThan(0);
    const menuItems = Component.find('MenuItem');
    checkMenuItems(menuItems, targets);
  });

  it('should render based on languageDictionary but missing menu items unblock', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const Component = renderComponent({
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

    expect(Component.length).to.be.greaterThan(0);
    const menuItems = Component.find('MenuItem');
    checkMenuItems(menuItems, targets);
  });

});
