import axios from 'axios';
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

      console.log({
        isAuthenticated: this.props.auth.isAuthenticated,
        isAuthenticating: this.props.auth.isAuthenticating  
      })


      if (!this.props.auth.isAuthenticated && !this.props.auth.isAuthenticating) {
        if (!this.props.location) {
          console.log('pushing to login');

          this.props.push('/login');
        } else {

          console.log(`pushing to login with return url: ${this.props.location.pathname}${this.props.location.search ? this.props.location.search : ''}`);
          this.props.push(`/login?returnUrl=${this.props.location.pathname}${this.props.location.search ? this.props.location.search : ''}`);
        }
      }

      axios.defaults.headers.common['dae-locale'] = window.config.LOCALE;
    }

    render() {
      // if (this.props.auth.isAuthenticated) {
      if (true) {
        return <InnerComponent {...this.props} />;
      }

      return <div></div>;
    }
  }

  return connect((state) => ({ auth: state.auth }), { push })(RequireAuthenticationContainer);
}
