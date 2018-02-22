import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error } from 'auth0-extension-ui';
import { Modal } from 'react-bootstrap';

import { userActions, scriptActions } from '../../../actions';
import { UserForm, ValidationError } from '../../../components/Users';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    userCreate: state.userCreate,
    accessLevel: state.accessLevel,
    connections: state.connections,
    languageDictionary: state.languageDictionary,
    userForm: state.form
  });

  static actionsToProps = {
    ...userActions,
    ...scriptActions
  }

  static propTypes = {
    accessLevel: PropTypes.object.isRequired,
    connections: PropTypes.object.isRequired,
    userCreate: PropTypes.object.isRequired,
    userForm: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
    getDictValue: PropTypes.func.isRequired,
    cancelCreateUser: PropTypes.func.isRequired,
    userFields: PropTypes.array.isRequired,
    languageDictionary: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userCreate !== this.props.userCreate ||
      nextProps.languageDictionary !== this.props.languageDictionary ||
      nextProps.connections !== this.props.connections ||
      nextProps.accessLevel !== this.props.accessLevel ||
      nextProps.userFields !== this.props.userFields;
  }

  onSubmit = (user) => {
    const languageDictionary = this.props.languageDictionary.get('record').toJS();
    this.props.createUser(user, languageDictionary);
  }

  render() {
    const { error, loading, record } = this.props.userCreate.toJS();
    const connections = this.props.connections.toJS();
    const accessLevel = this.props.accessLevel.get('record').toJS();
    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    return (
      <Modal show={record !== null} className="modal-overflow-visible" onHide={this.props.cancelCreateUser}>
        <Modal.Header closeButton={loading} className="has-border">
          <Modal.Title>{languageDictionary.createDialogTitle || 'Create User'}</Modal.Title>
        </Modal.Header>

        <UserForm
          customFields={this.props.userFields || []}
          customFieldGetter={field => field.create}
          connections={connections.records} initialValues={record}
          createMemberships={accessLevel.createMemberships}
          memberships={accessLevel.memberships}
          getDictValue={this.props.getDictValue}
          onClose={this.props.cancelCreateUser}
          onSubmit={this.onSubmit}
          languageDictionary={languageDictionary}
        >
          <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, error)} />
          <ValidationError
            userForm={this.props.userForm}
            customFields={this.props.userFields || []}
            errorMessage={languageDictionary.validationError}
          />
        </UserForm>
      </Modal>
    );
  }
});
