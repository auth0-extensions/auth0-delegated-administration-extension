import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';
import { getName } from '../../../utils/display';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    unblock: state.unblock,
    settings: state.settings,
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
    const { user, error, requesting, loading } = this.props.unblock.toJS();

    const userFields = _.get(this.props.settings.toJS(), 'record.settings.userFields', []);

    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.unblockDialogMessage ||
      'Do you really want to unblock {username}? ' +
      'After doing so the user will be able to sign in again.';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    return (
      <Confirm
        title={languageDictionary.unblockDialogTitle || "Unblock User?"}
        show={requesting}
        loading={loading}
        onCancel={cancelUnblockUser}
        languageDictionary={languageDictionary}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, error)} />
        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
