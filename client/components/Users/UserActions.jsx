import React, { Component, PropTypes } from 'react';
import { MenuItem, DropdownButton } from 'react-bootstrap';

export default class UserActions extends Component {
  static propTypes = {
    blockUser: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    changeUsername: PropTypes.func.isRequired,
    databaseConnections: PropTypes.object.isRequired,
    deleteUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    removeMfa: PropTypes.func.isRequired,
    resendVerificationEmail: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    userFields: PropTypes.array.isRequired
  }

  state = {
    user: null,
    loading: false
  };

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
  }

  getDeleteAction = (user, loading) => (
    <MenuItem disabled={loading || false} onClick={this.deleteUser}>
      Delete User
    </MenuItem>
  )

  getEditAction = (user, loading) => {
    if (!this.props.userFields || !this.props.userFields.length) {
      return null;
    }

    /* Only display this if there are editable fields */
    const fieldsWithEdit = _.filter(this.props.userFields, field => field.edit);
    if (fieldsWithEdit.length <= 0) return null;

    return (
      <MenuItem disabled={loading || false} onClick={this.editUser}>
        Edit User
      </MenuItem>
    );
  }

  getResetPasswordAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.resetPassword}>
        Reset Password
      </MenuItem>
    );
  }

  getChangePasswordAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.changePassword}>
        Change Password
      </MenuItem>
    );
  }

  getChangeUsernameAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length || !user.username) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.changeUsername}>
        Change Username
      </MenuItem>
    );
  }

  getChangeEmailAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.changeEmail}>
        Change Email
      </MenuItem>
    );
  }

  getResendEmailVerificationAction = (user, loading) => {
    if (!this.state.databaseConnections || !this.state.databaseConnections.length || user.email_verified) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.resendVerificationEmail}>
        Resend Verification Email
      </MenuItem>
    );
  }

  getMultifactorAction = (user, loading) => {
    if (!user.multifactor || !user.multifactor.length) {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.removeMfa}>
        Remove MFA ({user.multifactor[0]})
      </MenuItem>
    );
  }

  getBlockedAction = (user, loading) => {
    if (user.blocked) {
      return (
        <MenuItem disabled={loading || false} onClick={this.unblockUser}>
          Unblock User
        </MenuItem>
      );
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.blockUser}>
        Block User
      </MenuItem>
    );
  }

  deleteUser = () => {
    this.props.deleteUser(this.state.user);
  }

  editUser = () => {
    this.props.editUser(this.state.user);
  }

  resetPassword = () => {
    this.props.resetPassword(this.state.user, this.state.databaseConnections[0]);
  }

  changePassword = () => {
    this.props.changePassword(this.state.user, this.state.databaseConnections[0]);
  }

  changeUsername = () => {
    this.props.changeUsername(this.state.user, this.state.databaseConnections[0]);
  }

  changeEmail = () => {
    this.props.changeEmail(this.state.user, this.state.databaseConnections[0]);
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

  removeMfa = () => {
    this.props.removeMfa(this.state.user, this.state.user.multifactor[0]);
  }

  render() {
    if (!this.state.user) {
      return null;
    }

    return (
      <DropdownButton bsStyle="success" title="Actions" id="user-actions">
        {this.getMultifactorAction(this.state.user, this.state.loading)}
        {this.getBlockedAction(this.state.user, this.state.loading)}
        {this.getResetPasswordAction(this.state.user, this.state.loading)}
        {this.getChangePasswordAction(this.state.user, this.state.loading)}
        {this.getDeleteAction(this.state.user, this.state.loading)}
        {this.getEditAction(this.state.user, this.state.loading)}
        {this.getChangeUsernameAction(this.state.user, this.state.loading)}
        {this.getChangeEmailAction(this.state.user, this.state.loading)}
        {this.getResendEmailVerificationAction(this.state.user, this.state.loading)}
      </DropdownButton>
    );
  }
}
