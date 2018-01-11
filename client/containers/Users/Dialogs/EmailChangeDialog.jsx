import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    emailChange: state.emailChange,
    settings: state.settings,
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    cancelEmailChange: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    emailChange: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.languageDictionary !== this.props.languageDictionary ||
      nextProps.emailChange !== this.props.emailChange;
  }

  onConfirm = () => {
    this.props.changeEmail(this.refs.user.value, this.refs.email.value);
  }

  renderConnection(connection, userFields) {
    const connectionField = _.find(userFields, field => field.property === 'connection');

    const displayConnection = !connectionField || (_.isBoolean(connectionField.edit) && connectionField.edit === true) || _.isObject(connectionField.edit);

    const label = (connectionField && connectionField.label) || 'Connection';
    return displayConnection ? <div className="form-group">
      <label id="email-change-connection-label" className="col-xs-2 control-label">{label}</label>
      <div className="col-xs-9">
        <input id="email-change-connection-input" type="text" readOnly="readonly" className="form-control" value={connection} />
      </div>
    </div> : <div></div>;
  }

  render() {
    const { cancelEmailChange } = this.props;
    const { userId, customField, connection, userName, userEmail, error, requesting, loading } = this.props.emailChange.toJS();

    const defaultEmailValue = customField ? customField.display(customField.user) : userEmail;

    const userFields = _.get(this.props.settings.toJS(), 'record.settings.userFields', []);

    const languageDictionary = this.props.languageDictionary.get('record').toJS();
    const { preText, postText } = getDialogMessage(
      languageDictionary.changeEmailMessage, 'username',
      {
        preText: 'Do you really want to change the email for ',
        postText: '?'
      }
    );

    const emailField = _.find(userFields, field => field.property === 'email');

    const emailLabel = (emailField && emailField.label) || 'Email';

    return (
      <Confirm
        title={languageDictionary.changeEmailTitle || 'Change Email?'}
        show={requesting} loading={loading} onCancel={cancelEmailChange}
        onConfirm={this.onConfirm}
      >
        <Error message={error} />
        <p>
          {preText}<strong>{userName}</strong>{postText}
        </p>
        <div className="row">
          <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
            { this.renderConnection(connection, userFields) }
            <div className="form-group">
              <label id="email-change-email-label" className="col-xs-2 control-label">{emailLabel}</label>
              <div className="col-xs-9">
                <input id="email-change-email-input" ref="email" type="email" className="form-control" defaultValue={defaultEmailValue} />
              </div>
            </div>
            <input ref="user" type="hidden" readOnly="readonly" className="form-control" value={userId} />
          </form>
        </div>
      </Confirm>
    );
  }
});
