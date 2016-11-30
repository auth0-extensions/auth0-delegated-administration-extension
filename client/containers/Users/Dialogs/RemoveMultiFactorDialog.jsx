import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { userActions } from '../../../actions';
import { Error, Confirm } from 'auth0-extension-ui';


export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    mfa: state.mfa
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    cancelRemoveMultiFactor: PropTypes.func.isRequired,
    removeMultiFactor: PropTypes.func.isRequired,
    mfa: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.mfa !== this.props.mfa;
  }

  onConfirm = () => {
    this.props.removeMultiFactor();
  }

  render() {
    const { cancelRemoveMultiFactor } = this.props;
    const { userName, error, requesting, loading } = this.props.mfa.toJS();

    return (
      <Confirm title="Remove Multi Factor Authentication?" show={requesting} loading={loading} onCancel={cancelRemoveMultiFactor} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to remove the multi factor authentication settings for <strong>{userName}</strong>?
          This will allow the user to authenticate and reconfigure a new device.
        </p>
      </Confirm>
    );
  }
});
