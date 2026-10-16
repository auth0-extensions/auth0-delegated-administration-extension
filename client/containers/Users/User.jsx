import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Tabs, Tab } from 'react-bootstrap';

import { logActions, userActions, userDeviceActions, userLogActions } from '../../actions';

import './User.styles.css';

import * as dialogs from './Dialogs';
import TabsHeader from '../../components/TabsHeader';
import LogDialog from '../../components/Logs/LogDialog';
import LogsTable from '../../components/Logs/LogsTable';
import { UserActions, UserDevices, UserHeader, UserProfile, UserInfo } from '../../components/Users';

import getUserDatabaseConnections from '../../selectors/getUserDatabaseConnections';

const TABS = {
  INFO: 1,
  DEVICES: 2,
  LOGS: 3,
  PROFILE: 4
};

export default connectContainer(class extends Component {
  static stateToProps = state => ({
    user: state.user,
    databaseConnections: getUserDatabaseConnections(state),
    log: state.log,
    logs: state.user.get('logs'),
    devices: state.user.get('devices'),
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary.get('record').toJS() || {}
  });

  static actionsToProps = {
    ...logActions,
    ...userActions,
    ...userDeviceActions,
    ...userLogActions
  };

  static propTypes = {
    languageDictionary: PropTypes.object.isRequired,
    accessLevel: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    user: PropTypes.object,
    log: PropTypes.object,
    logs: PropTypes.object,
    devices: PropTypes.object,
    params: PropTypes.object,
    clearLog: PropTypes.func.isRequired,
    fetchLog: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchUserDevicesIfNeeded: PropTypes.func.isRequired,
    fetchUserLogsIfNeeded: PropTypes.func.isRequired,
    getDictValue: PropTypes.func.isRequired
  };

  state = {
    activeTab: TABS.INFO
  };

  componentDidMount() {
    this.props.fetchUser(this.props.params.id);
  }

  componentDidUpdate(prevProps) {
    // The route element is reused when only :id changes, so load the new user here.
    if (prevProps.params.id !== this.props.params.id) {
      this.setState({ activeTab: TABS.INFO });
      this.props.fetchUser(this.props.params.id);
    }
  }

  // Devices and logs are only fetched the first time their tab is opened (per user).
  onTabSelect = (activeTab) => {
    this.setState({ activeTab });

    const userId = this.props.params.id;
    if (activeTab === TABS.DEVICES) {
      this.props.fetchUserDevicesIfNeeded(userId);
    } else if (activeTab === TABS.LOGS) {
      this.props.fetchUserLogsIfNeeded(userId);
    }
  };

  renderProfile(suppressRawData, user, languageDictionary, settings) {
    if (suppressRawData) return null;

    return (
      <Tab eventKey={TABS.PROFILE} title={languageDictionary.userProfileTabTitle || 'Profile'}>
        <UserProfile loading={user.get('loading')} user={user.get('record')} error={user.get('error')} languageDictionary={languageDictionary} settings={settings} />
      </Tab>
    );

  }

  render() {
    const { user, databaseConnections, log, logs, devices, settings, languageDictionary } = this.props;
    const userFields = (settings && settings.userFields) || [];
    const allowedUserFields = userFields.filter(field => field.property !== 'picture' && field.property !== 'client');
    const suppressRawData = settings && settings.suppressRawData === true;
    const role = this.props.accessLevel.role;
    const userId = this.props.params.id;
    // Until a lazy tab has been requested for this user, treat it as loading rather than empty.
    const devicesLoading = devices.get('loading') || devices.get('userId') !== userId;
    const logsLoading = logs.get('loading') || logs.get('userId') !== userId;
    const originalTitle = (settings.dict && settings.dict.title) || window.config.TITLE || 'User Management';
    document.title = `${languageDictionary.userTitle || 'User Details'} - ${originalTitle}`;

    return (
      <div className="user">
        <TabsHeader role={role} languageDictionary={languageDictionary} />
        <div className="row content-header">
          <div className="col-xs-12">
            <h1 className="pull-left">{languageDictionary.userTitle || 'User Details'}</h1>
            <div className="pull-right">
              <UserActions
                role={role}
                user={user.get('record')}
                loading={user.get('loading')}
                userFields={allowedUserFields}
                databaseConnections={databaseConnections}
                deleteUser={this.props.requestDeleteUser}
                changeFields={this.props.requestFieldsChange}
                resetPassword={this.props.requestPasswordReset}
                changePassword={this.props.requestPasswordChange}
                removeMfa={this.props.requestRemoveMultiFactor}
                blockUser={this.props.requestBlockUser}
                unblockUser={this.props.requestUnblockUser}
                removeBlockedIPs={this.props.requestRemoveBlockedIPs}
                changeUsername={this.props.requestUsernameChange}
                changeEmail={this.props.requestEmailChange}
                resendVerificationEmail={this.props.requestResendVerificationEmail}
                languageDictionary={languageDictionary}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <UserHeader loading={user.get('loading')} user={user.get('record')} error={user.get('error')} userFields={allowedUserFields} languageDictionary={languageDictionary} />
          </div>
        </div>
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs activeKey={this.state.activeTab} onSelect={this.onTabSelect} animation={false} id="user-info-tabs">
              <Tab eventKey={TABS.INFO} title={languageDictionary.userUserInfoTabTitle || 'User Information'}>
                <UserInfo
                  loading={user.get('loading')} user={user.get('record')}
                  memberships={user.get('memberships') && user.get('memberships').toJSON()}
                  userFields={allowedUserFields}
                  error={user.get('error')}
                  settings={settings}
                  languageDictionary={languageDictionary}
                />
              </Tab>
              <Tab eventKey={TABS.DEVICES} title={languageDictionary.userDevicesTabTitle || 'Devices'}>
                <UserDevices
                  loading={devicesLoading} devices={devices.get('records')}
                  languageDictionary={languageDictionary}
                  settings={settings}
                  error={devices.get('error')}
                />
              </Tab>
              <Tab eventKey={TABS.LOGS} title={languageDictionary.userLogsTabTitle || 'Logs'}>
                <LogDialog
                  onClose={this.props.clearLog} error={log.get('error')}
                  loading={log.get('loading')} log={log.get('record')}
                  languageDictionary={languageDictionary}
                  settings={settings}
                  logId={log.get('logId')}
                />
                <LogsTable
                  onOpen={this.props.fetchLog} loading={logsLoading}
                  logs={logs.get('records')}
                  languageDictionary={languageDictionary}
                  error={logs.get('error')}
                  settings={settings}
                  isUserLogs={true}
                />
              </Tab>
              { this.renderProfile(suppressRawData, user, languageDictionary, settings) }
            </Tabs>
          </div>
        </div>
        <dialogs.DeleteDialog />
        <dialogs.FieldsChangeDialog getDictValue={this.props.getDictValue} userFields={allowedUserFields} errorTranslator={settings.errorTranslator}/>
        <dialogs.EmailChangeDialog />
        <dialogs.PasswordResetDialog />
        <dialogs.PasswordChangeDialog />
        <dialogs.UsernameChangeDialog />
        <dialogs.ResendVerificationEmailDialog />
        <dialogs.BlockDialog />
        <dialogs.UnblockDialog />
        <dialogs.RemoveBlocksDialog />
        <dialogs.RemoveMultiFactorDialog />
      </div>
    );
  }
});
