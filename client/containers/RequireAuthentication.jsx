import axios from 'axios';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function RequireAuthentication(InnerComponent) {
  function RequireAuthenticationContainer(props) {
    const navigate = useNavigate();
    const { isAuthenticated, isAuthenticating } = props.auth;
    const { location } = props;

    useEffect(() => {
      axios.defaults.headers.common['dae-locale'] = window.config.LOCALE;
    }, []);

    useEffect(() => {
      if (!isAuthenticated && !isAuthenticating) {
        if (!location) {
          navigate('/login');
        } else {
          navigate(`/login?returnUrl=${location.pathname}${location.search ? location.search : ''}`);
        }
      }
    }, [isAuthenticated, isAuthenticating, location, navigate]);

    if (isAuthenticated) {
      return <InnerComponent {...props} />;
    }

    return <div></div>;
  }

  RequireAuthenticationContainer.propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  return connect((state) => ({ auth: state.auth.toJS() }))(RequireAuthenticationContainer);
}
