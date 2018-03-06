import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

export default class UserHeader extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    userFields: React.PropTypes.array.isRequired,
    languageDictionary: React.PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  getName(user, userFields) {

    const nameField = _.find(userFields, field => field.property === 'name');

    if (nameField && _.isFunction(nameField.display)) {
      /* Custom Name Field function, use that instead of email address */
      return nameField.display(user);
    }

    return user.name || user.nickname || user.email;
  }

  getEmail(user, userFields) {
    // Check for user.email right away to make sure the user has been initialized
    if (!user.email) return <div></div>;

    let email = user.email;

    const emailField = _.find(userFields, field => field.property === 'email');

    if (emailField && _.isFunction(emailField.display)) {
      /* Custom Name Field function, use that instead of email address */
      email = emailField.display(user);
    }

    if (!email || email.length === 0) {
      return <div></div>;
    }

    return <span className="user-label user-head-email">{email}</span>;
  }

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }

    const user = this.props.user.toJS();
    const userFields = this.props.userFields || [];
    const languageDictionary = this.props.languageDictionary || {};

    return (
      <div className="user-header">
        <img
          role="presentation"
          className="img-polaroid"
          src={user.picture}
          alt={languageDictionary.userImageTitle || 'User Image'}
          title={languageDictionary.userImageTitle || 'User Image'}
        />
        <div className="user-bg-box" style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
          <img
            role="presentation"
            className="user-bg"
            src={user.picture}
            alt={languageDictionary.userImageTitle || 'User Image'}
            title={languageDictionary.userImageTitle || 'User Image'}
          />
          <div className="box-content">
            <div className="login-count">
              <span className="lined-text">{ languageDictionary.loginsCountLabel || 'Logins Count:' }</span>
              <strong>{user.logins_count || 0}</strong>
            </div>
            <div className="username-area">
              <h2>
                <span className="name user-head-nickname">
                  { this.getName(user, userFields) }
                </span>
                { this.getEmail(user, userFields) }
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
