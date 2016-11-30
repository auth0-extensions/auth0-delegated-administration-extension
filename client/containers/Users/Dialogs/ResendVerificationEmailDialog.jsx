import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    verificationEmail: state.verificationEmail
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    cancelResendVerificationEmail: PropTypes.func.isRequired,
    resendVerificationEmail: PropTypes.func.isRequired,
    verificationEmail: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.verificationEmail !== this.props.verificationEmail;
  }

  onConfirm = () => {
    this.props.resendVerificationEmail(this.props.verificationEmail.toJS().userId);
  }

  render() {
    const { cancelResendVerificationEmail } = this.props;
    const { userName, error, requesting, loading } = this.props.verificationEmail.toJS();

    return (
      <Confirm title="Resend Verification Email?" show={requesting} loading={loading} onCancel={cancelResendVerificationEmail} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to resend verification email to <strong>{userName}</strong>?
        </p>
      </Confirm>
    );
  }
});
