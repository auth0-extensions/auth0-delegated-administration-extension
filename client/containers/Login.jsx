import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { login } from '../actions/auth';
import { LoadingPanel, Confirm, Error } from 'auth0-extension-ui';

class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object.isRequired
  };

  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.push(this.props.auth.returnTo || '/users');
    } else if (!this.props.auth.isAuthenticating && !this.props.auth.error) {
      this.props.login(this.props.location.query.returnUrl, this.props.location.query.ui_locales);
    }
  }

  login() {
    this.props.login(this.props.location.query.returnUrl, this.props.location.query.ui_locales);
  }

  render() {
    const { auth, languageDictionary } = this.props;

    if (auth.error) {
      return (
        <div className="row">
          <Confirm
            dialogClassName="login-error"
            confirmMessage={languageDictionary.loginErrorButtonText || "Login"}
            loading={false}
            title={languageDictionary.loginErrorTitle || "Login Error"}
            show={this.props.auth.error}
            onConfirm={this.login.bind(this)}
          >
            <Error show={true} message={this.props.auth.error}/>
          </Confirm>
        </div>
      );
    }

    if (!auth.isAuthenticating) {
      return <div></div>;
    }

    return (
      <div className="row">
        <div className="col-xs-12 wrapper">
          <LoadingPanel/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth.toJS(),
    languageDictionary: state.languageDictionary.get('record').toJS()
  };
}

export default connect(mapStateToProps, { login, push })(LoginContainer);
