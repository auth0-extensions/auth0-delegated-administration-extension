import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';

import submitForm from '../../../actions/submitForm';
import { userActions } from '../../../actions';
import { Error, Confirm } from 'auth0-extension-ui';
import { useMfaField } from '../../../utils/useDefaultFields';
import UserFieldsForm from '../../../components/Users/UserFieldsForm';
import { getName, mapValues } from '../../../utils/display';
import getDialogMessage from './getDialogMessage';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    mfa: state.mfa,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    submitForm,
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
    this.props.submitForm('remove-mfa');
  };

  onSubmit = (form) => {
    this.props.removeMultiFactor(form.user_id, form.multifactor);
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

    const fields = _.cloneDeep(userFields) || [];
    const providers = user && user.multifactor ? user.multifactor : [];
    const hasPasskey = providers.includes('passkey');
    const nonPasskeyProviders = providers.filter(p => p !== 'passkey');
    useMfaField(true, fields, providers);

    const allowedFields = [ 'user_id', 'multifactor' ];
    const filteredFields = _.filter(fields,
      field => _.includes(allowedFields, field.property));

    const UserFieldsFormInstance = UserFieldsForm('remove-mfa', this.onSubmit.bind(this));

    const initialValues = mapValues(user, allowedFields, filteredFields, 'edit', languageDictionary);
    if (initialValues.multifactor) {
      let multifactor = initialValues.multifactor;
      if (!Array.isArray(multifactor)) {
        try {
          multifactor = JSON.parse(multifactor);
        } catch (e) {
          // already a single string provider value
        }
      }
      initialValues.multifactor = Array.isArray(multifactor) ? multifactor[0] : multifactor;
    }

    return (
      <Confirm
        title={languageDictionary.removeMultiFactorTitle || "Remove Multi Factor Authentication?" }
        show={requesting}
        loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelRemoveMultiFactor}
        closeLabel={languageDictionary.closeButtonText}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
        <p>
          {message}
        </p>
        {hasPasskey && nonPasskeyProviders.length > 0 && (
          <p>
            <b>Note:</b> Removing all authentication factors at once is not supported when the user has at least one passkey registered. Remove any passkeys first, and then if multiple types of factors remain, an option to remove all of the remaining types will be added below.
          </p>
        )}
        <UserFieldsFormInstance
          initialValues={initialValues}
          isEditForm={true}
          fields={filteredFields}
          languageDictionary={languageDictionary}
        />
      </Confirm>
    );
  }
});
