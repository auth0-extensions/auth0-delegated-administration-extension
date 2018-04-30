import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import submitForm from '../../../actions/submitForm';
import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';
import { getName, mapValues } from '../../../utils/display';
import {
  usePasswordFields,
  useDisabledConnectionField,
  useDisabledEmailField
} from '../../../utils/useDefaultFields';

import UserFieldsForm from '../../../components/Users/UserFieldsForm';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class PasswordChangeDialog extends Component {
  static stateToProps = (state) => ({
    passwordChange: state.passwordChange,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    submitForm,
    ...userActions
  };

  static propTypes = {
    passwordChange: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired,
    cancelPasswordChange: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.passwordChange !== this.props.passwordChange || nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.submitForm('change-password');
  };

  onSubmit = (changeForm) => {
    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    this.props.changePassword(changeForm, languageDictionary);
  };

  render() {
    const { cancelPasswordChange, settings } = this.props;
    const { connection, user, error, requesting, loading } = this.props.passwordChange.toJS();

    const userFields = settings.userFields || [];

    if (!requesting) {
      return null;
    }

    const languageDictionary = this.props.languageDictionary.get('record').toJS();
    const messageFormat = languageDictionary.changePasswordMessage ||
      'Do you really want to reset the password for {username}? ' +
      'You\'ll need a safe way to communicate the new password to your user, never send the user this' +
      ' new password in clear text.';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    const fields = _.cloneDeep(userFields) || [];
    usePasswordFields(true, fields);
    useDisabledConnectionField(true, fields, connection);
    useDisabledEmailField(true, fields);

    const allowedFields = ['email', 'connection', 'password', 'repeatPassword'];
    const filteredFields = _.filter(fields,
      field => _.includes(allowedFields, field.property));

    const UserFieldsFormInstance = UserFieldsForm('change-password', this.onSubmit);

    return (
      <Confirm
        title={languageDictionary.changePasswordTitle || 'Change Password?'}
        show={requesting}
        loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelPasswordChange}
        closeLabel={languageDictionary.closeButtonText}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
        <p>
          {message}
        </p>
        <UserFieldsFormInstance
          initialValues={mapValues(user, allowedFields, filteredFields, 'edit', languageDictionary)}
          isEditForm={true}
          fields={filteredFields}
          languageDictionary={languageDictionary}
        />
      </Confirm>
    );
  }
});
