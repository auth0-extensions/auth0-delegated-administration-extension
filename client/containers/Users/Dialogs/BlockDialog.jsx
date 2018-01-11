import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    block: state.block,
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  };

  static propTypes = {
    cancelBlockUser: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.block !== this.props.block ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.blockUser();
  };

  render() {
    const { cancelBlockUser } = this.props;
    const { userName, error, requesting, loading } = this.props.block.toJS();

    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const { preText, postText } = getDialogMessage(
      languageDictionary.blockDialogMessage, 'username',
      {
        preText: 'Do you really want to block ',
        postText: '? After doing so the user will not be able to sign in anymore.'
      }
    );

    return (
      <Confirm title={languageDictionary.blockDialogTitle || "Block User?"}
               show={requesting} loading={loading}
               onCancel={cancelBlockUser} onConfirm={this.onConfirm}
               languageDictionary={languageDictionary}>
        <Error message={error}/>
        <p>
          {preText}<strong>{userName}</strong>{postText}
        </p>
      </Confirm>
    );
  }
});
