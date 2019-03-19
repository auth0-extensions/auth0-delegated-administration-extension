import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabPane } from 'auth0-extension-ui';

export default class TabsHeader extends Component {
  static propTypes = {
    role: PropTypes.number,
    languageDictionary: PropTypes.object
  };

  render() {
    const hasLogsAccess = this.props.role >= 2;

    const languageDictionary = this.props.languageDictionary || {};

    return (
      <div className="widget-title title-with-nav-bars">
        <ul className="nav nav-tabs">
          <TabPane
            title={languageDictionary.userUsersTabTitle || "Users"}
            route="users" />
          {hasLogsAccess ?
            <TabPane
              title={languageDictionary.userLogsTabTitle || "Logs"}
              route="logs" /> : null}
        </ul>
      </div>
    );
  }
}
