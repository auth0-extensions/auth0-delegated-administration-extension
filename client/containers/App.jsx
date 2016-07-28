import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import { configurationActions } from '../actions';

import Header from '../components/Header';
import { Sidebar, SidebarItem } from '../components/Dashboard';

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    issuer: PropTypes.string,
    logout: PropTypes.func
  };

  render() {
    return (
      <div>
        <Header user={this.props.user} issuer={this.props.issuer} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <Sidebar>
              <SidebarItem title="Users" route="/users" icon="icon icon-budicon-292" />
              <SidebarItem title="Logs" route="/logs" icon="icon icon-budicon-292" />
            </Sidebar>
            <div id="content" className="col-xs-10">
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    issuer: state.auth.get('issuer'),
    user: state.auth.get('user'),
    ruleStatus: state.ruleStatus
  };
}

export default connect(select, { logout, ...configurationActions })(App);
