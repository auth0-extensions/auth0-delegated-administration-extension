import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { userActions } from '../../../actions';
import { Error, Confirm } from 'auth0-extension-ui';
import getDialogMessage from './getDialogMessage';


export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    mfa: state.mfa,
    languageDictionary: state.languageDictionary
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
    return nextProps.mfa !== this.props.mfa ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.removeMultiFactor();
  }

  render() {
    const { cancelRemoveMultiFactor } = this.props;
    const { userName, error, requesting, loading } = this.props.mfa.toJS();

    const languageDictionary = this.props.languageDictionary.get('record').toJS();
    const { preText, postText } = getDialogMessage(
      languageDictionary.removeMultiFactorMessage, 'username',
      {
        preText: 'Do you really want to remove the multi factor authentication settings for ',
        postText: '? This will allow the user to authenticate and reconfigure a new device.'
      }
    );

    return (
      <Confirm
        title={languageDictionary.removeMultiFactorTitle || "Remove Multi Factor Authentication?" }
        show={requesting}
        loading={loading}
        onCancel={cancelRemoveMultiFactor}
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
