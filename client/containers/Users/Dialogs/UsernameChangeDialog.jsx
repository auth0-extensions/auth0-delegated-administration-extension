import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    usernameChange: state.usernameChange
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    cancelUsernameChange: PropTypes.func.isRequired,
    changeUsername: PropTypes.func.isRequired,
    usernameChange: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.usernameChange !== this.props.usernameChange;
  }

  onConfirm = () => {
    this.props.changeUsername(this.refs.user.value, this.refs.username.value);
  }

  render() {
    const { cancelUsernameChange } = this.props;
    const { userId, connection, userNameToChange, userName, error, requesting, loading } = this.props.usernameChange.toJS();

    if (!requesting) {
      return null;
    }

    return (
      <Confirm title="Change Username?" show={requesting} loading={loading} onCancel={cancelUsernameChange} onConfirm={this.onConfirm}>
        <Error message={error} />
        <p>
          Do you really want to change the username for <strong>{userName}</strong>?
        </p>
        <div className="row">
          <form className="form-horizontal col-xs-12" style={{ marginTop: '40px' }}>
            <div className="form-group">
              <label className="col-xs-2 control-label">Connection</label>
              <div className="col-xs-9">
                <input type="text" readOnly="readonly" className="form-control" value={connection} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-xs-2 control-label">Username</label>
              <div className="col-xs-9">
                <input ref="username" type="text" className="form-control" defaultValue={userNameToChange} />
              </div>
            </div>
            <input ref="user" type="hidden" readOnly="readonly" className="form-control" value={userId} />
          </form>
        </div>
      </Confirm>
    );
  }
});
