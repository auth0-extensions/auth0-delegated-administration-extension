import React, { Component } from 'react';
import { NavigationLink } from '../components/Dashboard';
import * as constants from '../constants';

export default class TabsHeader extends Component {
  render() {
    const  isRoot = this.props.role === constants.SUPER_ADMIN;
    return (
      <div className="widget-title title-with-nav-bars">
        <ul className="nav nav-tabs">
          <NavigationLink title="Users" route="/users"/>
          { isRoot ?
            <NavigationLink title="Logs" route="/logs"/>
            : ''}
        </ul>
      </div>
    )
  }
}