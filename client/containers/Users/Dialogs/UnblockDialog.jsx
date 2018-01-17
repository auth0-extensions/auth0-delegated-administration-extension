import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    unblock: state.unblock,
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  };

  static propTypes = {
    cancelUnblockUser: PropTypes.func.isRequired,
    unblockUser: PropTypes.func.isRequired,
    unblock: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.unblock !== this.props.unblock ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.unblockUser();
  };

  render() {
    const { cancelUnblockUser } = this.props;
    const { userName, error, requesting, loading } = this.props.unblock.toJS();
    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const { preText, postText } = getDialogMessage(
      languageDictionary.unblockDialogMessage, 'username',
      {
        preText: 'Do you really want to unblock ',
        postText: '? After doing so the user will be able to sign in again.'
      }
    );

    return (
      <Confirm
        title={languageDictionary.unblockDialogTitle || "Unblock User?"}
        show={requesting}
        loading={loading}
        onCancel={cancelUnblockUser}
        languageDictionary={languageDictionary}
        onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          {preText}<strong>{userName}</strong>{postText}
        </p>
      </Confirm>
    );
  }
});
