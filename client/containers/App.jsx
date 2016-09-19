import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import { applicationActions, connectionActions, authActions } from '../actions';

import Header from '../components/Header';

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    settings: PropTypes.object,
    issuer: PropTypes.string,
    logout: PropTypes.func,
    fetchApplications: PropTypes.func.isRequired,
    fetchConnections: PropTypes.func.isRequired,
    getAccessLevel: PropTypes.func.isRequired,
    getAppSettings: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchApplications();
    this.props.fetchConnections();
    this.props.getAccessLevel();
    this.props.getAppSettings();
  }

  render() {
    return (
      <div>
        <Header
          user={this.props.user}
          issuer={this.props.issuer}
          settings={this.props.settings}
          onLogout={this.props.logout} accessLevel={this.props.accessLevel.toJSON()}
        />
        <div className="container">
          <div className="row">
            <section className="content-page current">
              <div className="col-xs-12">
                <div id="content-area" className="tab-content">
                  {React.cloneElement(this.props.children, { accessLevel: this.props.accessLevel.toJSON() })}
                </div>
              </div>
            </section>
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
    ruleStatus: state.ruleStatus,
    accessLevel: state.accessLevel.get('record'),
    settings: state.settings.get('record')
  };
}

export default connect(select, { logout, ...applicationActions, ...connectionActions, ...authActions })(App);
