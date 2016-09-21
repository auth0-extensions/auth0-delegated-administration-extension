import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { userActions } from '../../../actions';
import { UserForm } from '../../../components/Users';
import { Error, Confirm } from '../../../components/Dashboard';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    userCreate: state.userCreate,
    accessLevel: state.accessLevel,
    connections: state.connections
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    accessLevel: PropTypes.object.isRequired,
    connections: PropTypes.object.isRequired,
    userCreate: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
    cancelCreateUser: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userCreate !== this.props.userCreate || nextProps.connections !== this.props.connections || nextProps.accessLevel !== this.props.accessLevel;
  }

  onSubmit = (user) => {
    this.props.createUser(user);
  }

  onConfirm = () => {
    this.refs.form.submit();
  }

  render() {
    const { error, loading, record } = this.props.userCreate.toJS();
    const connections = this.props.connections.toJS();
    const accessLevel = this.props.accessLevel.get('record').toJS();

    return (
      <Confirm title="Create User" show={record !== null} loading={loading} onCancel={this.props.cancelCreateUser} onConfirm={this.onConfirm}>
        <Error message={error} />
        <UserForm ref="form" connections={connections.records} initialValues={record} memberships={accessLevel.memberships} onSubmit={this.onSubmit} />
      </Confirm>
    );
  }
});
