import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import submitForm from '../../../actions/submitForm';
import { useDisabledConnectionField, useUsernameField } from '../../../utils/useDefaultFields';
import { getName, mapValues } from '../../../utils/display';
import getDialogMessage from './getDialogMessage';
import UserFieldsForm from '../../../components/Users/UserFieldsForm';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    usernameChange: state.usernameChange,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    connections: state.connections,
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    submitForm,
    ...userActions
  };

  static propTypes = {
    cancelUsernameChange: PropTypes.func.isRequired,
    changeUsername: PropTypes.func.isRequired,
    usernameChange: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.languageDictionary !== this.props.languageDictionary ||
      nextProps.usernameChange !== this.props.usernameChange;
  }

  onConfirm = () => {
    this.props.submitForm('change-username');
  };

  onSubmit = (formData) => {
    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    this.props.changeUsername(this.props.usernameChange.toJS().user.user_id, formData, languageDictionary);
  };

  render() {
    const { cancelUsernameChange, connections, settings } = this.props;
    const { user, connection, error, requesting, loading } = this.props.usernameChange.toJS();

    if (!requesting) {
      return null;
    }

    const userFields = settings.userFields || [];

    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.changeUsernameMessage ||
      'Do you really want to change the username for {username}?';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    const allowedFields = ['username', 'connection'];
    const initialValues = mapValues(user, allowedFields, userFields);
    const fields = _.cloneDeep(userFields) || [];
    useUsernameField(true, fields, connections.get('records').toJS(), connection, initialValues);
    useDisabledConnectionField(true, fields, connection);

    const filteredFields = _.filter(fields,
      field => _.includes(allowedFields, field.property));

    const UserFieldsFormInstance = UserFieldsForm('change-username', this.onSubmit);

    return (
      <Confirm
        title={languageDictionary.changeUsernameTitle || 'Change Username?'}
        show={requesting}
        loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelUsernameChange}
        languageDictionary={languageDictionary}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, error, settings.errorTranslator)} />
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
