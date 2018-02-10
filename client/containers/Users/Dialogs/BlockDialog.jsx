import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';
import { getName } from '../../../utils/display';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    block: state.block,
    settings: state.settings,
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
    const { user, error, requesting, loading } = this.props.block.toJS();

    const userFields = _.get(this.props.settings.toJS(), 'record.settings.userFields', []);

    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.blockDialogMessage ||
      'Do you really want to block {username}? '+
      'After doing so the user will not be able to sign in anymore.';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    return (
      <Confirm title={languageDictionary.blockDialogTitle || "Block User?"}
               show={requesting} loading={loading}
               onCancel={cancelBlockUser} onConfirm={this.onConfirm}
               languageDictionary={languageDictionary}>
        <Error message={error}/>
        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
