import React, { PropTypes, Component } from 'react';
import './UserInfoField.css';

export default class UserInfoField extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.title !== this.props.title || nextProps.children !== this.props.children;
  }

  render() {
    const { title, children } = this.props;
    return (
      <div className="user-info-field">
        <div className="user-info-field-title">{title}</div>
        <span>{children}</span>
      </div>
    );
  }
}
