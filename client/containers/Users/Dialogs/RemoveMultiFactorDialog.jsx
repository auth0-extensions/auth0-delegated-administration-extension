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
    useMfaField(true, fields, providers);

    const allowedFields = [ 'user_id', 'multifactor' ];
    const filteredFields = _.filter(fields,
      field => _.includes(allowedFields, field.property));

    const UserFieldsFormInstance = UserFieldsForm('remove-mfa', this.onSubmit.bind(this));

    const initialValues = mapValues(user, allowedFields, filteredFields, 'edit', languageDictionary);
    if (initialValues.multifactor) {
      initialValues.multifactor = JSON.parse(initialValues.multifactor)[0];
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
