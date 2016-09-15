import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { userActions } from '../../../actions';
import { Error, Confirm } from '../../../components/Dashboard';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    unblock: state.unblock
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    cancelUnblockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    unblock: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.unblock !== this.props.unblock;
  }

  onConfirm = () => {
    this.props.unblockUser();
  }

  render() {
    const { cancelUnblockUser } = this.props;
    const { userName, error, requesting, loading } = this.props.unblock.toJS();

    return (
      <Confirm title="Unblock User?" show={requesting} loading={loading} onCancel={cancelUnblockUser} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to unblock <strong>{userName}</strong>?
          After doing so the user will be able to sign in again.
        </p>
      </Confirm>
    );
  }
});
