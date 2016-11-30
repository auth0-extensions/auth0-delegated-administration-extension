import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';


export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    block: state.block
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    cancelBlockUser: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.block !== this.props.block;
  }

  onConfirm = () => {
    this.props.blockUser();
  }

  render() {
    const { cancelBlockUser } = this.props;
    const { userName, error, requesting, loading } = this.props.block.toJS();

    return (
      <Confirm title="Block User?" show={requesting} loading={loading} onCancel={cancelBlockUser} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to block <strong>{userName}</strong>?
          After doing so the user will not be able to sign in anymore.
        </p>
      </Confirm>
    );
  }
});
