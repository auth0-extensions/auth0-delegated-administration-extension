import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error } from 'auth0-extension-ui';
import { Modal } from 'react-bootstrap';

import { userActions, scriptActions } from '../../../actions';
import { UserForm } from '../../../components/Users';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    userCreate: state.userCreate,
    accessLevel: state.accessLevel,
    connections: state.connections,
    settings: state.settings
  });

  static actionsToProps = {
    ...userActions,
    ...scriptActions
  }

  static propTypes = {
    accessLevel: PropTypes.object.isRequired,
    connections: PropTypes.object.isRequired,
    userCreate: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
    getDictValue: PropTypes.func.isRequired,
    cancelCreateUser: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userCreate !== this.props.userCreate || nextProps.connections !== this.props.connections || nextProps.accessLevel !== this.props.accessLevel || nextProps.settings !== this.props.settings;
  }

  onSubmit = (user) => {
    this.props.createUser(user);
  }

  render() {
    const { error, loading, record } = this.props.userCreate.toJS();
    const connections = this.props.connections.toJS();
    const accessLevel = this.props.accessLevel.get('record').toJS();
    const { settings } = this.props.settings.get('record').toJS();
    const customFields = (settings && settings.customFields) || [];

    return (
      <Modal show={record !== null} className="modal-overflow-visible" onHide={this.props.cancelCreateUser}>
        <Modal.Header closeButton={loading} className="has-border">
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>

        <UserForm
          customFields={customFields}
          connections={connections.records} initialValues={record}
          createMemberships={accessLevel.createMemberships}
          memberships={accessLevel.memberships}
          getDictValue={this.props.getDictValue}
          onClose={this.props.cancelCreateUser}
          onSubmit={this.onSubmit}
        >
          <Error message={error} />
        </UserForm>
      </Modal>
    );
  }
});
