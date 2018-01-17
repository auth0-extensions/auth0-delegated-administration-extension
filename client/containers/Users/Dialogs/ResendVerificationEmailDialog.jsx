import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    verificationEmail: state.verificationEmail,
    languageDictionary: state.languageDictionary
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
    return nextProps.verificationEmail !== this.props.verificationEmail ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.resendVerificationEmail(this.props.verificationEmail.toJS().userId);
  }

  render() {
    const { cancelResendVerificationEmail } = this.props;
    const { userName, error, requesting, loading } = this.props.verificationEmail.toJS();

    const languageDictionary = this.props.languageDictionary.get('record').toJS();
    const { preText, postText } = getDialogMessage(
      languageDictionary.resendVerificationEmailMessage, 'username',
      {
        preText: 'Do you really want to resend verification email to ',
        postText: '?'
      }
    );

    return (
      <Confirm
        title={languageDictionary.resendVerificationEmailTitle || "Resend Verification Email?" }
        show={requesting}
        loading={loading}
        onCancel={cancelResendVerificationEmail}
        languageDictionary={languageDictionary}
        onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          {preText}<strong>{userName}</strong>{postText}
        </p>
      </Confirm>
    );
  }
});
