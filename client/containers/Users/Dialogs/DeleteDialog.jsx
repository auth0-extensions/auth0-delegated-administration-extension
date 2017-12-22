import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    userDelete: state.userDelete
  });

  static actionsToProps = {
    ...userActions
  };

  static propTypes = {
    cancelDeleteUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    userDelete: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.userDelete !== this.props.userDelete;
  }

  onConfirm = () => {
    this.props.deleteUser();
  };

  render() {
    const { cancelDeleteUser } = this.props;
    const { userName, error, requesting, loading } = this.props.userDelete.toJS();

    const languageDictionary = this.props.languageDictionary || {};
    const { preText, postText } = getDialogMessage(
      languageDictionary.deleteDialogMessage, 'username',
      {
        preText: 'Do you really want to delete ',
        postText: '? This will completely remove the user and cannot be undone.'
      }
    );

    return (
      <Confirm title={languageDictionary.deleteDialogTitle || "Delete User?"}
               show={requesting} loading={loading}
               onCancel={cancelDeleteUser} onConfirm={this.onConfirm}
               languageDictionary={languageDictionary}>
        <Error message={error}/>
        <p>
          {preText}<strong>{userName}</strong>{postText}
        </p>
      </Confirm>
    );
  }
});
