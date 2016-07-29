import React, { Component, PropTypes } from 'react';
import { Error, Confirm } from '../../Dashboard';

export default class PasswordResetDialog extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    requesting: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    error: PropTypes.string
  }
  render() {
    const { userName, error, requesting, loading, onCancel, onConfirm } = this.props;

    return (
      <Confirm title="Reset Password?" show={requesting} loading={loading} onCancel={onCancel} onConfirm={onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to reset the password for <strong>{userName}</strong>?
          This will send an email to the user allowing them to choose a new password.
        </p>
      </Confirm>
    );
  }
}
