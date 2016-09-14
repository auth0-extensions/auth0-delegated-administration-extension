import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { Error, Confirm } from '../../components/Dashboard';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    resendVerificationEmail: state.resendVerificationEmail
  });

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.resendVerificationEmail !== this.props.resendVerificationEmail;
  }

  onConfirm = () => {
    this.props.onConfirm(this.refs.user.value);
  }

  render() {
    const { onCancel } = this.props;
    const { userId, userName, error, requesting, loading } = this.props.resendVerificationEmail.toJS();

    if (!requesting) {
      return null;
    }

    return (
      <Confirm title="Change Username?" show={requesting} loading={loading} onCancel={onCancel} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to resend verification email to <strong>{userName}</strong>?
        </p>
        <input ref="user" type="hidden" readOnly="readonly" className="form-control" value={userId} />
      </Confirm>
    );
  }
});
