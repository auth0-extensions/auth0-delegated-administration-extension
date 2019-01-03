import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import submitForm from '../../../actions/submitForm';
import { userActions } from '../../../actions';
import { useDisabledConnectionField, useEmailField } from '../../../utils/useDefaultFields';
import { getName, mapValues } from '../../../utils/display';
import getDialogMessage from './getDialogMessage';
import UserFieldsForm from '../../../components/Users/UserFieldsForm';
import getErrorMessage from '../../../utils/getErrorMessage';


export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    connections: state.connections,
    emailChange: state.emailChange,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    submitForm,
    ...userActions
  };

  static propTypes = {
    cancelEmailChange: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    connections: PropTypes.object.isRequired,
    emailChange: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.languageDictionary !== this.props.languageDictionary ||
      nextProps.emailChange !== this.props.emailChange;
  }

  onConfirm = () => {
    this.props.submitForm('change-email');
  };

  onSubmit = (emailForm) => {
    const { user } = this.props.emailChange.toJS();

    this.props.changeEmail(user, emailForm, this.props.languageDictionary.get('record').toJS());
  };

  render() {
    const { cancelEmailChange, settings, connections } = this.props;
    const { user, connection, error, requesting, loading } = this.props.emailChange.toJS();

    const userFields = settings.userFields || [];

    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.changeEmailMessage ||
      'Do you really want to change the email for {username}?';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    const fields = _.cloneDeep(userFields) || [];
    useEmailField(true, fields);
    useDisabledConnectionField(true, fields, connection, connections.get('records').toJS());

    const allowedFields = ['email', 'connection'];
    const filteredFields = _.filter(fields,
      field => _.includes(allowedFields, field.property));

    const UserFieldsFormInstance = UserFieldsForm('change-email', this.onSubmit.bind(this));

    return (
      <Confirm
        title={languageDictionary.changeEmailTitle || 'Change Email?'}
        confirmMessage={languageDictionary.dialogConfirmText} cancelMessage={languageDictionary.dialogCancelText}
        show={requesting} loading={loading} onCancel={cancelEmailChange}
        onConfirm={this.onConfirm}
        closeLabel={languageDictionary.closeButtonText}
      >
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
