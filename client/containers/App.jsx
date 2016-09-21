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

  getDictValue = (index, defaultValue) => {
    const appSettings = this.props.settings;
    let val = '';
    if (appSettings.get('settings') && appSettings.get('settings').get('dict')) {
      val = appSettings.get('settings').get('dict').get(index)
    }
    return val || defaultValue;
  }

  render() {
    return (
      <div>
        <Header
          user={this.props.user}
          issuer={this.props.issuer}
          getDictValue={this.getDictValue}
          onLogout={this.props.logout} accessLevel={this.props.accessLevel.toJSON()}
        />
        <div className="container">
          <div className="row">
            <section className="content-page current">
              <div className="col-xs-12">
                <div id="content-area" className="tab-content">
                  {React.cloneElement(this.props.children, {
                    accessLevel: this.props.accessLevel.toJSON(),
                    appSettings: this.props.settings.toJSON(),
                    getDictValue: this.getDictValue
                  })}
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
