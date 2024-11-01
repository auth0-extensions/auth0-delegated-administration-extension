import _ from 'lodash';
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
    unblock: state.unblock,
    settings: (state.settings.get('record') && state.settings.get('record').settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  };

  static propTypes = {
    cancelUnblockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    unblock: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.unblock !== this.props.unblock ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.unblockUser();
  };

  render() {
    const { cancelUnblockUser, settings } = this.props;
    const { user, error, requesting, loading } = this.props.unblock;

    const userFields = settings.userFields || [];

    const languageDictionary = this.props.languageDictionary.get('record');

    const messageFormat = languageDictionary.unblockDialogMessage ||
      'Do you really want to unblock {username}? ' +
      'After doing so the user will be able to sign in again.';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    return (
      <Confirm
        title={languageDictionary.unblockDialogTitle || "Unblock User?"}
        show={requesting}
        loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelUnblockUser}
        closeLabel={languageDictionary.closeButtonText}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
