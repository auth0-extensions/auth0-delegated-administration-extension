import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { userActions } from '../../../actions';
import { Error, Confirm } from '../../../components/Dashboard';


export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    userDelete: state.userDelete
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    cancelDeleteUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    userDelete: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userDelete !== this.props.userDelete;
  }

  onConfirm = () => {
    this.props.deleteUser();
  }

  render() {
    const { cancelDeleteUser } = this.props;
    const { userName, error, requesting, loading } = this.props.userDelete.toJS();

    return (
      <Confirm title="Delete User?" show={requesting} loading={loading} onCancel={cancelDeleteUser} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to delete <strong>{userName}</strong>?
          This will completely remove the user and cannot be undone.
        </p>
      </Confirm>
    );
  }
});
