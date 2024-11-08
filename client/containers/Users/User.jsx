import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Tabs, Tab } from 'react-bootstrap';

import { logActions, userActions } from '../../actions';

import './User.styles.css';

import * as dialogs from './Dialogs';
import TabsHeader from '../../components/TabsHeader';
import LogDialog from '../../components/Logs/LogDialog';
import LogsTable from '../../components/Logs/LogsTable';
import { UserActions, UserDevices, UserHeader, UserProfile, UserInfo } from '../../components/Users';

import getUserDatabaseConnections from '../../selectors/getUserDatabaseConnections';
import { removeBlockedIPs } from "../../reducers/removeBlockedIPs";

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
    ...userActions
  }

  static propTypes = {
    languageDictionary: PropTypes.object.isRequired,
    accessLevel: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    user: PropTypes.object,
    log: PropTypes.object,
    logs: PropTypes.object,
    devices: PropTypes.object,
    params: PropTypes.object,
    clearLog: React.PropTypes.func.isRequired,
    fetchLog: React.PropTypes.func.isRequired,
    fetchUser: React.PropTypes.func.isRequired,
    getDictValue: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchUser(this.props.params.id);
  }

  renderProfile(suppressRawData, user, languageDictionary, settings) {
    if (suppressRawData) return null;

    return (
      <Tab eventKey={4} title={languageDictionary.userProfileTabTitle || 'Profile'}>
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
                user={user}
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
            <Tabs defaultActiveKey={1} animation={false} id="user-info-tabs">
              <Tab eventKey={1} title={languageDictionary.userUserInfoTabTitle || 'User Information'}>
                <UserInfo
                  loading={user.get('loading')} user={user.get('record')}
                  memberships={user.get('memberships') && user.get('memberships').toJSON()}
                  userFields={allowedUserFields}
                  error={user.get('error')}
                  settings={settings}
                  languageDictionary={languageDictionary}
                />
              </Tab>
              <Tab eventKey={2} title={languageDictionary.userDevicesTabTitle || 'Devices'}>
                <UserDevices
                  loading={devices.get('loading')} devices={devices.get('records')}
                  languageDictionary={languageDictionary}
                  settings={settings}
                  error={devices.get('error')}
                />
              </Tab>
              <Tab eventKey={3} title={languageDictionary.userLogsTabTitle || 'Logs'}>
                <LogDialog
                  onClose={this.props.clearLog} error={log.get('error')}
                  loading={log.get('loading')} log={log.get('record')}
                  languageDictionary={languageDictionary}
                  settings={settings}
                  logId={log.get('logId')}
                />
                <LogsTable
                  onOpen={this.props.fetchLog} loading={logs.get('loading')}
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
