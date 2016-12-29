import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    emailChange: state.emailChange
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
    return nextProps.emailChange !== this.props.emailChange;
  }

  onConfirm = () => {
    this.props.changeEmail(this.refs.user.value, this.refs.email.value);
  }

  render() {
    const { cancelEmailChange } = this.props;
    const { userId, connection, userEmail, userName, error, requesting, loading } = this.props.emailChange.toJS();

    return (
      <Confirm
        title="Change Email?" show={requesting} loading={loading} onCancel={cancelEmailChange}
        onConfirm={this.onConfirm}
      >
        <Error message={error} />
        <p>
          Do you really want to change the email for <strong>{userName}</strong>?
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
              <label className="col-xs-2 control-label">Email</label>
              <div className="col-xs-9">
                <input ref="email" type="email" className="form-control" defaultValue={userEmail} />
              </div>
            </div>
            <input ref="user" type="hidden" readOnly="readonly" className="form-control" value={userId} />
          </form>
        </div>
      </Confirm>
    );
  }
});
