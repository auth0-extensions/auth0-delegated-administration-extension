import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';
import { getName } from '../../../utils/display';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    verificationEmail: state.verificationEmail,
    settings: state.settings,
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
    const { cancelResendVerificationEmail } = this.props;
    const { user, error, requesting, loading } = this.props.verificationEmail.toJS();

    const userFields = _.get(this.props.settings.toJS(), 'record.settings.userFields', []);
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
        onCancel={cancelResendVerificationEmail}
        languageDictionary={languageDictionary}
        onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
