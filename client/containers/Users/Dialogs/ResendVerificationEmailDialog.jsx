import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';
import { getName } from '../../../utils/display';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    verificationEmail: state.verificationEmail,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
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
    this.props.resendVerificationEmail(this.props.verificationEmail.toJS().user.user_id);
  }

  render() {
    const { cancelResendVerificationEmail, settings } = this.props;
    const { user, error, requesting, loading } = this.props.verificationEmail.toJS();

    const userFields = settings.userFields || [];
    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.resendVerificationEmailMessage ||
      'Do you really want to resend verification email to {username}?';

    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    return (
      <Confirm
        title={languageDictionary.resendVerificationEmailTitle || "Resend Verification Email?" }
        show={requesting}
        loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelResendVerificationEmail}
        closeLabel={languageDictionary.closeButtonText}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, error, settings.errorTranslator)} />
        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
