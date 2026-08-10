import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, DropdownButton } from 'react-bootstrap';
import _ from 'lodash';
import { RESERVED_USER_FIELDS } from '../../constants';

export default class UserActions extends Component {
  static propTypes = {
    blockUser: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    changeUsername: PropTypes.func.isRequired,
    databaseConnections: PropTypes.object,
    deleteUser: PropTypes.func.isRequired,
    changeFields: PropTypes.func.isRequired,
    removeMfa: PropTypes.func.isRequired,
    resendVerificationEmail: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    removeBlockedIPs: PropTypes.func.isRequired,
    user: PropTypes.object,
    loading: PropTypes.bool,
    role: PropTypes.number.isRequired,
    userFields: PropTypes.array.isRequired,
    languageDictionary: PropTypes.object
  }

  get user() {
    return this.props.user ? this.props.user.toJS() : null;
  }

  get databaseConnections() {
    return this.props.databaseConnections ? this.props.databaseConnections.toJS() : [];
  }

  get languageDictionary() {
    return this.props.languageDictionary || {};
  }

  getDeleteAction = (user, loading) => {
    const deleteField = _.filter(this.props.userFields, field => field.property === 'delete' && field.edit === false);
    if (deleteField.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.deleteUser}>
        {this.languageDictionary.deleteUserMenuItemText || 'Delete User'}
      </MenuItem>
    );
  }

  getChangeFieldsAction = (user, loading) => {
    if (!this.props.userFields || !this.props.userFields.length) {
      return null;
    }

    /* Only display this if there are editable fields */
    const fieldsWithEdit = _.filter(this.props.userFields, field => !_.includes(RESERVED_USER_FIELDS, field.property) && field.edit);
    if (fieldsWithEdit.length <= 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.changeFields}>
        {this.languageDictionary.changeFieldsMenuItemText || 'Change Profile'}
      </MenuItem>
    );
  }

  getResetPasswordAction = (user, loading) => {
    if (!this.databaseConnections || !this.databaseConnections.length) {
      return null;
    }

    /* Check if settings are disabling the editing of password */
    const falsePasswordEditFields = _.filter(this.props.userFields, field => field.property === 'password' && field.edit === false);
    const trueResetPasswordEditFields = _.filter(this.props.userFields, field => field.property === 'resetPassword' && field.edit === true);
    if (falsePasswordEditFields.length > 0 && trueResetPasswordEditFields.length <= 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.resetPassword}>
        {this.languageDictionary.resetPasswordMenuItemText || 'Reset Password'}
      </MenuItem>
    );
  }

  getChangePasswordAction = (user, loading) => {
    if (!this.databaseConnections || !this.databaseConnections.length) {
      return null;
    }

    /* Check if settings are disabling the editing of password */
    const falsePasswordEditFields = _.filter(this.props.userFields, field => field.property === 'password' && field.edit === false);
    if (falsePasswordEditFields.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.changePassword}>
        {this.languageDictionary.changePasswordMenuItemText || 'Change Password'}
      </MenuItem>
    );
  }

  getChangeUsernameAction = (user, loading) => {
    if (!this.databaseConnections || !this.databaseConnections.length || !user.username) {
      return null;
    }

    /* Check if settings are disabling the editing of username */
    const falseUsernameEditFields = _.filter(this.props.userFields, field => field.property === 'username' && field.edit === false);
    if (falseUsernameEditFields.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.changeUsername}>
        {this.languageDictionary.changeUsernameMenuItemText || 'Change Username'}
      </MenuItem>
    );
  }

  getChangeEmailAction = (user, loading) => {
    if (!this.databaseConnections || !this.databaseConnections.length) {
      return null;
    }

    /* Check if settings are disabling the editing of username */
    const falseEmailEditFields = _.filter(this.props.userFields, field => field.property === 'email' && field.edit === false);
    if (falseEmailEditFields.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.changeEmail}>
        {this.languageDictionary.changeEmailMenuItemText || 'Change Email'}
      </MenuItem>
    );
  }

  getResendEmailVerificationAction = (user, loading) => {
    if (!this.databaseConnections || !this.databaseConnections.length || user.email_verified) {
      return null;
    }

    /* Check if resending verification email option is enabled */
    const falseTriggerEmailVerified = _.filter(this.props.userFields, field => field.property === 'email_verified' && field.edit === false);
    if (falseTriggerEmailVerified.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.resendVerificationEmail}>
        {this.languageDictionary.resendVerificationEmailMenuItemText || "Resend Verification Email"}
      </MenuItem>
    );
  }

  getMultifactorAction = (user, loading) => {
    if (!user.multifactor || !user.multifactor.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.removeMfa}>
        {this.languageDictionary.removeMfaMenuItemText || "Remove MFA"}
      </MenuItem>
    );
  }

  getBlockedAction = (user, loading) => {
    if (user.blocked) {
      return (
        <MenuItem disabled={loading || false} onClick={this.unblockUser}>
          {this.languageDictionary.unblockUserMenuItemText || "Unblock User"}
        </MenuItem>
      );
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.blockUser}>
        {this.languageDictionary.blockUserMenuItemText || "Block User"}
      </MenuItem>
    );
  }

  getUserBlocksAction = (user, loading) => {
    if (user.blocked_for && user.blocked_for.length) {
      return (
        <MenuItem disabled={loading || false} onClick={this.removeBlockedIPs}>
          {this.languageDictionary.removeBlockedIPsMenuItemText || "Unblock for all IPs"}
        </MenuItem>
      );
    }

    return null;
  }

  deleteUser = () => {
    this.props.deleteUser(this.user);
  }

  changeFields = () => {
    const languageDictionary = this.props.languageDictionary;
    const currentUser = this.user;
    const ignoreFields = [ 'username', 'memberships', 'connection', 'password', 'email', 'repeatPassword' ];
    const customFields = _.filter(this.props.userFields, field =>
      !_.includes(ignoreFields, field.property) && field.edit && _.isFunction(field.edit.display));
    const user = Object.assign({}, currentUser);

    _.each(customFields, field => {
      try {
        _.update(user, field.property, (value) => field.edit.display(currentUser, value, languageDictionary));
      } catch (e) {
        /* Swallow eval errors */
        console.log(`Could not display ${field.property} because: ${e.message}`);
      }

    });

    this.props.changeFields(user);
  }

  resetPassword = () => {
    this.props.resetPassword(this.user, this.databaseConnections[0]);
  }

  changePassword = () => {
    this.props.changePassword(this.user, this.databaseConnections[0]);
  }

  static getDisplayObject(user, fields) {
    if (fields.length > 0) {
      let displayFunction = undefined;
      if (_.isFunction(fields[0].edit.display)) displayFunction = fields[0].edit.display;
      else if (!fields[0].edit.display && fields[0].edit.display !== false && _.isFunction(fields[0].display)) displayFunction = fields[0].display;
      if (displayFunction) return {
        display: displayFunction,
        user
      };
    }

    return null;
  }

  changeUsername = () => {
    const currentUser = this.user;
    const usernameEditFields = _.filter(this.props.userFields, field => field.property === 'username' && field.edit !== false && field.edit);
    this.props.changeUsername(currentUser, this.databaseConnections[0], UserActions.getDisplayObject(currentUser, usernameEditFields));
  }

  changeEmail = () => {
    const currentUser = this.user;
    const emailEditFields = _.filter(this.props.userFields, field => field.property === 'email' && field.edit !== false && field.edit);
    this.props.changeEmail(currentUser, this.databaseConnections[0], UserActions.getDisplayObject(currentUser, emailEditFields));
  }

  resendVerificationEmail = () => {
    this.props.resendVerificationEmail(this.user, this.databaseConnections[0]);
  }

  blockUser = () => {
    this.props.blockUser(this.user);
  }

  unblockUser = () => {
    this.props.unblockUser(this.user);
  }

  removeBlockedIPs = () => {
    this.props.removeBlockedIPs(this.user);
  }

  removeMfa = () => {
    this.props.removeMfa(this.user);
  }

  render() {
    const user = this.user;
    if (!user || this.props.role < 1) {
      return null;
    }

    const loading = this.props.loading || false;
    const languageDictionary = this.languageDictionary;
    const buttonTitle = languageDictionary.userActionsButton || 'Actions';

    return (
      <DropdownButton bsStyle="success" title={buttonTitle} id="user-actions">
        {this.getMultifactorAction(user, loading)}
        {this.getBlockedAction(user, loading)}
        {this.getUserBlocksAction(user, loading)}
        {this.getResetPasswordAction(user, loading)}
        {this.getResendEmailVerificationAction(user, loading)}
        {this.getChangeUsernameAction(user, loading)}
        {this.getChangeEmailAction(user, loading)}
        {this.getChangePasswordAction(user, loading)}
        {this.getChangeFieldsAction(user, loading)}
        {this.getDeleteAction(user, loading)}
      </DropdownButton>
    );
  }
}
