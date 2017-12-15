import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabPane } from 'auth0-extension-ui';

export default class TabsHeader extends Component {
  static propTypes = {
    role: PropTypes.number
  }

  render() {
    const isRoot = this.props.role === 2;
    return (
      <div className="widget-title title-with-nav-bars">
        <ul className="nav nav-tabs">
          <TabPane title="Users" route="users" />
          {isRoot ? <TabPane title="Logs" route="logs" /> : null}
        </ul>
      </div>
    );
  }
}
