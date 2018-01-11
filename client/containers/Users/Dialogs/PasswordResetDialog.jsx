import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getAppsForConnection from '../../../selectors/getAppsForConnection';
import getDialogMessage from './getDialogMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    passwordReset: state.passwordReset,
    appsForConnection: getAppsForConnection(state, state.passwordReset.get('connection')),
    settings: state.settings,
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    cancelPasswordReset: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    passwordReset: PropTypes.object.isRequired,
    appsForConnection: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.passwordReset !== this.props.passwordReset ||
      nextProps.languageDictionary !== this.props.languageDictionary ||
      nextProps.settings !== this.props.settings ||
      nextProps.appsForConnection !== this.props.appsForConnection;
  }

  onConfirm = () => {
    this.props.resetPassword(this.refs.client.value);
  };

  renderConnection(connection, userFields) {
    const connectionField = _.find(userFields, field => field.property === 'connection');

    const displayConnection = !connectionField || (_.isBoolean(connectionField.edit) && connectionField.edit === true) || _.isObject(connectionField.edit);

    const label = (connectionField && connectionField.label) || 'Connection';
    return displayConnection ? <div className="form-group">
      <label id="password-reset-connection-label" className="col-xs-2 control-label">{label}</label>
      <div className="col-xs-9">
        <input id="password-reset-connection-input" type="text" readOnly="readonly" className="form-control"
               value={connection}/>
      </div>
    </div> : <div></div>;
  }

  render() {
    const { cancelPasswordReset } = this.props;
    const { connection, userEmail, userName, error, requesting, loading } = this.props.passwordReset.toJS();

    if (!requesting) {
      return null;
    }

    const userFields = _.get(this.props.settings.toJS(), 'record.settings.userFields', []);
    const languageDictionary = this.props.languageDictionary.get('record').toJS();
    const { preText, postText } = getDialogMessage(
      languageDictionary.resetPasswordMessage, 'username',
      {
        preText: 'Do you really want to reset the password for ',
        postText: '? This will send an email to the user allowing them to choose a new password.'
      }
    );

    const emailField = _.find(userFields, field => field.property === 'email');
    const emailLabel = (emailField && emailField.label) || 'Email';
    const clientField = _.find(userFields, field => field.property === 'client');
    const clientLabel = (clientField && clientField.label) || 'Client';

    return (
      <Confirm
        title={languageDictionary.resetPasswordTitle || 'Reset Password?'}
        show={requesting}
        loading={loading}
        onCancel={cancelPasswordReset}
        languageDictionary={languageDictionary}
        onConfirm={this.onConfirm}>
        <Error message={error}/>
        <p>
          {preText}<strong>{userName}</strong>{postText}
        </p>
        <div className="row">
          <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
            <div className="form-group">
              <label id="password-reset-email-label" className="col-xs-2 control-label">{emailLabel}</label>
              <div className="col-xs-9">
                <input type="text" readOnly="readonly" className="form-control" value={userEmail}/>
              </div>
            </div>
            {this.renderConnection(connection, userFields)}
            <div className="form-group">
              <label id="password-reset-client-label" className="col-xs-2 control-label">{clientLabel}</label>
              <div className="col-xs-9">
                <select className="form-control" ref="client">
                  {this.props.appsForConnection.toJS().map((option, index) => <option key={index}
                                                                                      value={option.client_id}>{option.name}</option>)}
                </select>
              </div>
            </div>
          </form>
        </div>
      </Confirm>
    );
  }
});
