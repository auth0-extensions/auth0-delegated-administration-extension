import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

class DismissibleError extends Component {
  state = { dismissed: false };

  onDismiss = () => {
    this.setState({ dismissed: true });
    if (this.props.onDismiss) this.props.onDismiss();
  };

  render() {
    if (!this.props.show) return null;

    if (this.props.message) {
      if (this.state.dismissed) return null;

      return (
        <Alert bsStyle="danger" onDismiss={this.onDismiss}>
          <strong>{this.props.title}</strong> {this.props.message}
        </Alert>
      );
    }

    return this.props.children || <div />;
  }
}

DismissibleError.defaultProps = {
  show: true,
  title: 'Oh snap!'
};

DismissibleError.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  onDismiss: PropTypes.func,
  children: PropTypes.node
};

const ErrorAlert = props => <DismissibleError key={props.message} {...props} />;

ErrorAlert.propTypes = {
  message: PropTypes.string
};

export default ErrorAlert;
