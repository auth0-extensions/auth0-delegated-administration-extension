import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

export default function RequireAuthentication(InnerComponent) {
  class RequireAuthenticationContainer extends React.Component {
    static propTypes = {
      push: PropTypes.func.isRequired,
      auth: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired
    };

    componentWillMount() {
      this.requireAuthentication();
    }

    componentWillReceiveProps() {
      this.requireAuthentication();
    }

    requireAuthentication() {
      if (!this.props.auth.isAuthenticated && !this.props.auth.isAuthenticating) {
        if (!this.props.location) {
          this.props.push('/login');
        } else {
          this.props.push(`/login?returnUrl=${this.props.location.pathname}${this.props.location.search ? this.props.location.search : ''}`);
        }
      }
    }

    render() {
      if (this.props.auth.isAuthenticated) {
        return <InnerComponent {...this.props} />;
      }

      return <div></div>;
    }
  }

  return connect((state) => ({ auth: state.auth.toJS() }), { push })(RequireAuthenticationContainer);
}
