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
    block: state.block,
    settings: (state.settings.get('record') && state.settings.get('record').settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  };

  static propTypes = {
    cancelBlockUser: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.block !== this.props.block ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.blockUser();
  };

  render() {
    const { cancelBlockUser, settings } = this.props;
    const { user, error, requesting, loading } = this.props.block;

    const userFields = settings.userFields || [];

    const languageDictionary = this.props.languageDictionary.get('record');

    const messageFormat = languageDictionary.blockDialogMessage ||
      'Do you really want to block {username}? ' +
      'After doing so the user will not be able to sign in anymore.';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    return (
      <Confirm
        title={languageDictionary.blockDialogTitle || 'Block User?'}
        show={requesting} loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelBlockUser}
        onConfirm={this.onConfirm}
        closeLabel={languageDictionary.closeButtonText}
      >
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />

        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
