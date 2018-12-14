import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import submitForm from '../../../actions/submitForm';
import { userActions } from '../../../actions';
import getAppsForConnection from '../../../selectors/getAppsForConnection';
import getDialogMessage from './getDialogMessage';
import { getName, mapValues } from '../../../utils/display';
import {
  useClientField,
  useDisabledConnectionField,
  useDisabledEmailField
} from '../../../utils/useDefaultFields';

import UserFieldsForm from '../../../components/Users/UserFieldsForm';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    connections: state.connections,
    passwordReset: state.passwordReset,
    appsForConnection: getAppsForConnection(state),
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    submitForm,
    ...userActions
  };

  static propTypes = {
    cancelPasswordReset: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    connections: PropTypes.object.isRequired,
    passwordReset: PropTypes.object.isRequired,
    appsForConnection: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.passwordReset !== this.props.passwordReset ||
      nextProps.languageDictionary !== this.props.languageDictionary ||
      // nextProps.settings !== this.props.settings ||
      nextProps.appsForConnection !== this.props.appsForConnection;
  }

  onConfirm = () => {
    this.props.submitForm('reset-password');
  };

  onSubmit = (formData) => {
    this.props.resetPassword(formData);
  };

  render() {
    const { cancelPasswordReset, settings, connections } = this.props;
    const { connection, user, error, requesting, loading } = this.props.passwordReset.toJS();

    if (!requesting) {
      return null;
    }

    const userFields = settings.userFields || [];
    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.resetPasswordMessage ||
      'Do you really want to reset the password for {username}? '+
      'This will send an email to the user allowing them to choose a new password.';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    const fields = _.cloneDeep(userFields) || [];
    useClientField(true, fields, this.props.appsForConnection.toJS());
    useDisabledConnectionField(true, fields, connection, connections.get('records'));
    useDisabledEmailField(true, fields);

    const allowedFields = ['email', 'client', 'connection'];
    const filteredFields = _.filter(fields,
      field => _.includes(allowedFields, field.property));

    const UserFieldsFormInstance = UserFieldsForm('reset-password', this.onSubmit);

    return (
      <Confirm
        title={languageDictionary.resetPasswordTitle || 'Reset Password?'}
        show={requesting}
        loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelPasswordReset}
        closeLabel={languageDictionary.closeButtonText}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
        <p>
          {message}
        </p>
        <UserFieldsFormInstance
          initialValues={mapValues(user, allowedFields, filteredFields, 'edit', languageDictionary, { applications: this.props.appsForConnection.toJS() })}
          isEditForm={true}
          fields={filteredFields}
          languageDictionary={languageDictionary}
        />
      </Confirm>
    );
  }
});
