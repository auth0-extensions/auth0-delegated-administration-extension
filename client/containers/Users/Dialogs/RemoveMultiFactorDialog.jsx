import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';

import { userActions } from '../../../actions';
import { Error, Confirm } from 'auth0-extension-ui';
import getDialogMessage from './getDialogMessage';
import { getName } from '../../../utils/display';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    mfa: state.mfa,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  };

  static propTypes = {
    cancelRemoveMultiFactor: PropTypes.func.isRequired,
    removeMultiFactor: PropTypes.func.isRequired,
    mfa: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.mfa !== this.props.mfa ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.removeMultiFactor();
  };

  render() {
    const { cancelRemoveMultiFactor, settings } = this.props;
    const { user, error, requesting, loading } = this.props.mfa.toJS();

    const userFields = settings.userFields || [];
    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.removeMultiFactorMessage ||
      'Do you really want to remove the multi factor authentication settings for {username}? '+
      'This will allow the user to authenticate and reconfigure a new device.';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    return (
      <Confirm
        title={languageDictionary.removeMultiFactorTitle || "Remove Multi Factor Authentication?" }
        show={requesting}
        loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelRemoveMultiFactor}
        languageDictionary={languageDictionary}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, error, settings.errorTranslator)} />
        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
