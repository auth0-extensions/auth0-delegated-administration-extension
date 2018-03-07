import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';
import { applicationActions, connectionActions, authActions } from '../actions';
import { LoadingPanel } from 'auth0-extension-ui';

import Header from '../components/Header';

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    settings: PropTypes.object,
    issuer: PropTypes.string,
    logout: PropTypes.func,
    settingsLoading: PropTypes.bool,
    styleSettings: PropTypes.bool,
    fetchApplications: PropTypes.func.isRequired,
    fetchConnections: PropTypes.func.isRequired,
    getAccessLevel: PropTypes.func.isRequired,
    getAppSettings: PropTypes.func.isRequired,
    toggleStyleSettings: PropTypes.func.isRequired,
    languageDictionary: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.getAppSettings();
    this.props.fetchApplications();
    this.props.fetchConnections();
    this.props.getAccessLevel();
    this.props.getStyleSettings();
  }

  getDictValue = (index, defaultValue) => {
    const appSettings = this.props.settings;
    let val = '';
    if (appSettings.get('settings') && appSettings.get('settings').get('dict')) {
      val = appSettings.get('settings').get('dict').get(index);
    }
    return val || defaultValue;
  };

  onLogout = () => {
    const appSettings = this.props.settings;
    let logoutUrl;

    if (appSettings.get('settings') && appSettings.get('settings').get('dict')) {
      logoutUrl = appSettings.get('settings').get('dict').get('logoutUrl');
    }

    this.props.logout(logoutUrl);
  };

  render() {
    const { settingsLoading } = this.props;
    const languageDictionary = this.props.languageDictionary ? this.props.languageDictionary.toJS() : {};
    const settings = this.props.settings.get('settings') && this.props.settings.get('settings').toJS();
    const renderCssToggle = !!(settings && settings.css && settings.altcss);

    if (settingsLoading) {
      return <LoadingPanel show={settingsLoading} />;
    }
    return (
      <div>
        <Header
          user={this.props.user}
          issuer={this.props.issuer}
          getDictValue={this.getDictValue}
          onLogout={this.onLogout}
          onCssToggle={this.props.toggleStyleSettings}
          accessLevel={this.props.accessLevel.toJSON()}
          styleSettings={this.props.styleSettings}
          languageDictionary={languageDictionary}
          renderCssToggle={renderCssToggle}
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
    accessLevel: state.accessLevel.get('record'),
    settings: state.settings.get('record'),
    styleSettings: state.styleSettings,
    settingsLoading: state.settings.get('loading'),
    languageDictionary: state.languageDictionary.get('record')
  };
}

export default connect(select, { logout, ...applicationActions, ...connectionActions, ...authActions })(App);
