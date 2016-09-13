import React, { Component } from 'react';
import { NavigationLink } from '../components/Dashboard';

export default class TabsHeader extends Component {

  static propTypes = {
  };

  render() {
    return (
      <div className="widget-title title-with-nav-bars">
        <ul className="nav nav-tabs">
          <NavigationLink title="Users" route="/users"/>
          <NavigationLink title="Logs" route="/logs"/>
        </ul>
      </div>
    );
  }
}
