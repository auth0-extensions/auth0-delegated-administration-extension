import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error } from 'auth0-extension-ui';
import { Modal } from 'react-bootstrap';

import { userActions, scriptActions } from '../../../actions';
import { UserForm } from '../../../components/Users';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    userEdit: state.userEdit,
    accessLevel: state.accessLevel,
    connections: state.connections,
    userId: state.userEdit.toJS().userId
  });

  static actionsToProps = {
    ...userActions,
    ...scriptActions
  }

  static propTypes = {
    accessLevel: PropTypes.object.isRequired,
    connections: PropTypes.object.isRequired,
    userEdit: PropTypes.object.isRequired,
    editUser: PropTypes.func.isRequired,
    getDictValue: PropTypes.func.isRequired,
    cancelEditUser: PropTypes.func.isRequired,
    userFields: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userEdit !== this.props.userEdit || nextProps.connections !== this.props.connections || nextProps.accessLevel !== this.props.accessLevel || nextProps.userFields !== this.props.userFields;
  }

  onSubmit = (user) => {
    this.props.editUser(this.props.userId, user);
  }

  render() {
    const { error, loading, record } = this.props.userEdit.toJS();
    const connections = this.props.connections.toJS();
    const accessLevel = this.props.accessLevel.get('record').toJS();

    return (
      <Modal show={record !== null} className="modal-overflow-visible" onHide={this.props.cancelEditUser}>
        <Modal.Header closeButton={loading} className="has-border">
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>

        <UserForm
          customFields={this.props.userFields || []}
          customFieldGetter={field => field.edit}
          connections={connections.records} initialValues={record}
          createMemberships={accessLevel.createMemberships}
          memberships={accessLevel.memberships}
          getDictValue={this.props.getDictValue}
          onClose={this.props.cancelEditUser}
          onSubmit={this.onSubmit}
          method="Update"
        >
          <Error message={error} />
        </UserForm>
      </Modal>
    );
  }
});
