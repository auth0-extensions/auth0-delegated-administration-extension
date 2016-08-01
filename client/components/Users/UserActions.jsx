import React, { Component, PropTypes } from 'react';
import { MenuItem, DropdownButton } from 'react-bootstrap';

export default class UserActions extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    blockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    removeMfa: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired
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
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user;
  }

  getDeleteAction = (user, loading) => (
    <MenuItem disabled={loading || false} onClick={this.deleteUser}>
      Delete User
    </MenuItem>
  );

  getResetPasswordAction = (user, loading) => {
    if (!user.identities || user.identities[0].provider !== 'auth0') {
      return null;
    }

    return (
      <MenuItem disabled={loading || false} onClick={this.resetPassword}>
        Reset Password ({user.identities[0].connection})
      </MenuItem>
    );
  };

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

  resetPassword = () => {
    this.props.resetPassword(this.state.user, this.state.user.identities[0].connection);
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
        {this.getDeleteAction(this.state.user, this.state.loading)}
      </DropdownButton>
    );
  }
}
