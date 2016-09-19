import React, { Component } from 'react';
import { NavigationLink } from '../components/Dashboard';

export default class TabsHeader extends Component {
  static propTypes = {
    role: React.PropTypes.number
  };

  render() {
    const isRoot = this.props.role === 2;
    return (
      <div className="widget-title title-with-nav-bars">
        <ul className="nav nav-tabs">
          <NavigationLink title="Users" route="/users" />
          {isRoot ? <NavigationLink title="Logs" route="/logs" /> : null}
        </ul>
      </div>
    );
  }
}
