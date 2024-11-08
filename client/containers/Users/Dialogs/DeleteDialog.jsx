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
    userDelete: state.userDelete,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  };

  static propTypes = {
    cancelDeleteUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    userDelete: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.userDelete !== this.props.userDelete ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.deleteUser();
  };

  render() {
    const { cancelDeleteUser, settings } = this.props;
    const { user, error, requesting, loading } = this.props.userDelete.toJS();

    const userFields = settings.userFields || [];
    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.deleteDialogMessage ||
      'Do you really want to delete {username}? ' +
      'This will completely remove the user and cannot be undone.';

    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    return (
      <Confirm title={languageDictionary.deleteDialogTitle || "Delete User?"}
               show={requesting} loading={loading}
               confirmMessage={languageDictionary.dialogConfirmText} cancelMessage={languageDictionary.dialogCancelText}
               onCancel={cancelDeleteUser} onConfirm={this.onConfirm}
               closeLabel={languageDictionary.closeButtonText}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
