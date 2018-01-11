import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';
import { Error, Confirm } from 'auth0-extension-ui';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    passwordChange: state.passwordChange,
    settings: state.settings,
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    passwordChange: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired,
    cancelPasswordChange: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.passwordChange !== this.props.passwordChange || nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.changePassword(this.refs.password.value, this.refs.repeatPassword.value);
  }


  renderConnection(connection, userFields) {
    const connectionField = _.find(userFields, field => field.property === 'connection');

    const displayConnection = !connectionField || (_.isBoolean(connectionField.edit) && connectionField.edit === true) || _.isObject(connectionField.edit);

    const label = (connectionField && connectionField.label) || 'Connection';

    return displayConnection ? <div className="form-group">
      <label id="password-change-connection-label" className="col-xs-2 control-label">{label}</label>
      <div className="col-xs-9">
        <input id="password-change-connection-input" type="text" readOnly="readonly" className="form-control" value={connection} />
      </div>
    </div> : <div></div>;
  }

  render() {
    const { cancelPasswordChange } = this.props;
    const { connection, userEmail, userName, error, requesting, loading } = this.props.passwordChange.toJS();

    const userFields = _.get(this.props.settings.toJS(), 'record.settings.userFields', []);

    if (!requesting) {
      return null;
    }

    const languageDictionary = this.props.languageDictionary.get('record').toJS();
    const { preText, postText } = getDialogMessage(
      languageDictionary.changePasswordMessage, 'username',
      {
        preText: 'Do you really want to reset the password for ',
        postText: '? You\'ll need a safe way to communicate the new password to your user, never send the user this' +
        ' new password in clear text.'
      }
    );

    const emailField = _.find(userFields, field => field.property === 'email');
    const passwordField = _.find(userFields, field => field.property === 'password');
    const repeatPasswordField = _.find(userFields, field => field.property === 'repeatPassword');

    const emailLabel = (emailField && emailField.label) || 'Email';
    const passwordLabel = (passwordField && passwordField.label) || 'Password';
    const repeatPasswordLabel = (repeatPasswordField && repeatPasswordField.label) || 'Repeat Password';

    return (
      <Confirm
        title={languageDictionary.changePasswordTitle || 'Change Password?'}
        show={requesting}
        loading={loading}
        onCancel={cancelPasswordChange}
        languageDictionary={languageDictionary}
        onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          {preText}<strong>{userName}</strong>{postText}
        </p>
        <div className="row">
          <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
            <div className="form-group">
              <label id="password-change-email-label" className="col-xs-2 control-label">{emailLabel}</label>
              <div className="col-xs-9">
                <input type="text" readOnly="readonly" className="form-control" value={userEmail} />
              </div>
            </div>
            { this.renderConnection(connection, userFields) }
            <div className="form-group">
              <label id="password-change-password-label" className="col-xs-2 control-label">{passwordLabel}</label>
              <div className="col-xs-9">
                <input id="password-change-password-input" type="password" ref="password" className="form-control" />
              </div>
            </div>
            <div className="form-group">
              <label id="password-change-repeat-password-label" className="col-xs-2 control-label">{repeatPasswordLabel}</label>
              <div className="col-xs-9">
                <input id="password-change-repeat-password-input" type="password" ref="repeatPassword" className="form-control" />
              </div>
            </div>
          </form>
        </div>
      </Confirm>
    );
  }
});
