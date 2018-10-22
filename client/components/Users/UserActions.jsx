import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, DropdownButton } from 'react-bootstrap';
import _ from 'lodash';
import { removeBlockedIPs } from "../../reducers/removeBlockedIPs";

export default class UserActions extends Component {
  static propTypes = {
    blockUser: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    changeUsername: PropTypes.func.isRequired,
    databaseConnections: PropTypes.object.isRequired,
    deleteUser: PropTypes.func.isRequired,
    changeFields: PropTypes.func.isRequired,
    removeMfa: PropTypes.func.isRequired,
    resendVerificationEmail: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    removeBlockedIPs: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    role: PropTypes.number.isRequired,
    userFields: PropTypes.array.isRequired,
    languageDictionary: PropTypes.object
  }

  constructor(props) {
    super(props);

    if (props.user) {
      this.state = {
        user: props.user.toJS(),
        loading: props.loading
      };

      if (props.databaseConnections) {
        this.state.databaseConnections = props.databaseConnections.toJS();
      }
    } else {
      this.state = {
        user: null,
        loading: false
      };
    }

    this.state.languageDictionary = props.languageDictionary || {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      const { record, loading } = nextProps.user.toJS();
      this.setState({
        user: record,
        loading
      });
    }

    if (nextProps.databaseConnections) {
      this.setState({
        databaseConnections: nextProps.databaseConnections.toJS()
      });
    }

    if (nextProps.languageDictionary) {
      this.setState({
        languageDictionary: nextProps.languageDictionary
      });
    }
  }

  getDeleteAction = (user, loading) => {
    const deleteField = _.filter(this.props.userFields, field => field.property === 'delete' && field.edit === false);
    if (deleteField.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.deleteUser}>
        {this.state.languageDictionary.deleteUserMenuItemText || 'Delete User'}
      </MenuItem>
    );
  }

  getChangeFieldsAction = (user, loading) => {
    if (!this.props.userFields || !this.props.userFields.length) {
      return null;
    }

    /* Only display this if there are editable fields */
    const fieldsWithEdit = _.filter(this.props.userFields, field => field.edit);
    if (fieldsWithEdit.length <= 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.changeFields}>
        {this.state.languageDictionary.changeFieldsMenuItemText || 'Change Profile'}
      </MenuItem>
    );
  }

  getResetPasswordAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length) {
      return null;
    }

    /* Check if settings are disabling the editing of password */
    const falsePasswordEditFields = _.filter(this.props.userFields, field => field.property === 'reset_password' && field.edit === false);
    if (falsePasswordEditFields.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.resetPassword}>
        {this.state.languageDictionary.resetPasswordMenuItemText || 'Reset Password'}
      </MenuItem>
    );
  }

  getChangePasswordAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length) {
      return null;
    }

    /* Check if settings are disabling the editing of password */
    const falsePasswordEditFields = _.filter(this.props.userFields, field => field.property === 'password' && field.edit === false);
    if (falsePasswordEditFields.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.changePassword}>
        {this.state.languageDictionary.changePasswordMenuItemText || 'Change Password'}
      </MenuItem>
    );
  }

  getChangeUsernameAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length || !user.username) {
      return null;
    }

    /* Check if settings are disabling the editing of username */
    const falseUsernameEditFields = _.filter(this.props.userFields, field => field.property === 'username' && field.edit === false);
    if (falseUsernameEditFields.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.changeUsername}>
        {this.state.languageDictionary.changeUsernameMenuItemText || 'Change Username'}
      </MenuItem>
    );
  }

  getChangeEmailAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length) {
      return null;
    }

    /* Check if settings are disabling the editing of username */
    const falseEmailEditFields = _.filter(this.props.userFields, field => field.property === 'email' && field.edit === false);
    if (falseEmailEditFields.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.changeEmail}>
        {this.state.languageDictionary.changeEmailMenuItemText || 'Change Email'}
      </MenuItem>
    );
  }

  getResendEmailVerificationAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length || user.email_verified) {
      return null;
    }

    /* Check if resending verification email option is enabled */
    const falseTriggerEmailVerified = _.filter(this.props.userFields, field => field.property === 'email_verified' && field.edit === false);
    if (falseTriggerEmailVerified.length > 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.resendVerificationEmail}>
        {this.state.languageDictionary.resendVerificationEmailMenuItemText || "Resend Verification Email"}
      </MenuItem>
    );
  }

  getMultifactorAction = (user, loading) => {
    if (!user.multifactor || !user.multifactor.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.removeMfa}>
        {this.state.languageDictionary.removeMfaMenuItemText || "Remove MFA"}
      </MenuItem>
    );
  }

  getBlockedAction = (user, loading) => {
    if (user.blocked) {
      return (
        <MenuItem disabled={loading || false} onClick={this.unblockUser}>
          {this.state.languageDictionary.unblockUserMenuItemText || "Unblock User"}
        </MenuItem>
      );
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.blockUser}>
        {this.state.languageDictionary.blockUserMenuItemText || "Block User"}
      </MenuItem>
    );
  }

  getUserBlocksAction = (user, loading) => {
    if (user.blocked_for && user.blocked_for.length) {
      return (
        <MenuItem disabled={loading || false} onClick={this.removeBlockedIPs}>
          {this.state.languageDictionary.removeBlockedIPsMenuItemText || "Unblock for all IPs"}
        </MenuItem>
      );
    }

    return null;
  }

  deleteUser = () => {
    this.props.deleteUser(this.state.user);
  }

  changeFields = () => {
    this.props.changeFields(this.state.user);
  }

  resetPassword = () => {
    this.props.resetPassword(this.state.user, this.state.databaseConnections[0]);
  }

  changePassword = () => {
    this.props.changePassword(this.state.user, this.state.databaseConnections[0]);
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
    const usernameEditFields = _.filter(this.props.userFields, field => field.property === 'username' && field.edit !== false && field.edit);
    this.props.changeUsername(this.state.user, this.state.databaseConnections[0], UserActions.getDisplayObject(this.state.user, usernameEditFields));
  }

  changeEmail = () => {
    const emailEditFields = _.filter(this.props.userFields, field => field.property === 'email' && field.edit !== false && field.edit);
    this.props.changeEmail(this.state.user, this.state.databaseConnections[0], UserActions.getDisplayObject(this.state.user, emailEditFields));
  }

  resendVerificationEmail = () => {
    this.props.resendVerificationEmail(this.state.user, this.state.databaseConnections[0]);
  }

  blockUser = () => {
    this.props.blockUser(this.state.user);
  }

  unblockUser = () => {
    this.props.unblockUser(this.state.user);
  }

  removeBlockedIPs = () => {
    this.props.removeBlockedIPs(this.state.user);
  }

  removeMfa = () => {
    this.props.removeMfa(this.state.user);
  }

  render() {
    if (!this.state.user || this.props.role < 1) {
      return null;
    }

    const languageDictionary = this.props.languageDictionary || {};
    const buttonTitle = languageDictionary.userActionsButton || 'Actions';

    return (
      <DropdownButton bsStyle="success" title={buttonTitle} id="user-actions">
        {this.getMultifactorAction(this.state.user, this.state.loading)}
        {this.getBlockedAction(this.state.user, this.state.loading)}
        {this.getUserBlocksAction(this.state.user, this.state.loading)}
        {this.getResetPasswordAction(this.state.user, this.state.loading)}
        {this.getResendEmailVerificationAction(this.state.user, this.state.loading)}
        {this.getChangeUsernameAction(this.state.user, this.state.loading)}
        {this.getChangeEmailAction(this.state.user, this.state.loading)}
        {this.getChangePasswordAction(this.state.user, this.state.loading)}
        {this.getChangeFieldsAction(this.state.user, this.state.loading)}
        {this.getDeleteAction(this.state.user, this.state.loading)}
      </DropdownButton>
    );
  }
}
