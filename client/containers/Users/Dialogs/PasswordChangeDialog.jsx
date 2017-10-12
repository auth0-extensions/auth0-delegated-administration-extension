import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { userActions } from '../../../actions';
import { Error, Confirm } from 'auth0-extension-ui';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    passwordChange: state.passwordChange,
    settings: state.settings
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
    return nextProps.passwordChange !== this.props.passwordChange;
  }

  onConfirm = () => {
    this.props.changePassword(this.refs.password.value, this.refs.repeatPassword.value);
  }


  renderConnection(connection, userFields) {
    const connectionField = _.find(userFields, field => field.property === 'connection');

    const displayConnection = !connectionField || (_.isBoolean(connectionField.edit) && connectionField.edit === true) || _.isObject(connectionField.edit);

    return displayConnection ? <div className="form-group">
      <label className="col-xs-2 control-label">Connection</label>
      <div className="col-xs-9">
        <input type="text" readOnly="readonly" className="form-control" value={connection} />
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

    return (
      <Confirm title="Change Password?" show={requesting} loading={loading} onCancel={cancelPasswordChange} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to reset the password for <strong>{userName}</strong>?
          You'll need a safe way to communicate the new password to your user, never send the user this new password in clear text.
        </p>
        <div className="row">
          <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
            <div className="form-group">
              <label className="col-xs-2 control-label">Email</label>
              <div className="col-xs-9">
                <input type="text" readOnly="readonly" className="form-control" value={userEmail} />
              </div>
            </div>
            { this.renderConnection(connection, userFields) }
            <div className="form-group">
              <label className="col-xs-2 control-label">Password</label>
              <div className="col-xs-9">
                <input type="password" ref="password" className="form-control" />
              </div>
            </div>
            <div className="form-group">
              <label className="col-xs-2 control-label">Repeat Password</label>
              <div className="col-xs-9">
                <input type="password" ref="repeatPassword" className="form-control" />
              </div>
            </div>
          </form>
        </div>
      </Confirm>
    );
  }
});
