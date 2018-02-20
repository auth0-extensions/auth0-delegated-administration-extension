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

export default connectContainer(class extends Component {
  static stateToProps = state => ({
    user: state.user,
    databaseConnections: getUserDatabaseConnections(state),
    log: state.log,
    logs: state.user.get('logs'),
    devices: state.user.get('devices'),
    settings: state.settings.get('record').toJS().settings,
    languageDictionary: state.languageDictionary.get('record').toJS()
  });

  static actionsToProps = {
    ...logActions,
    ...userActions
  }

  static propTypes = {
    accessLevel: PropTypes.object.isRequired,
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

  renderProfile(suppressRawData, user, languageDictionary) {
    if (suppressRawData) return null;

    return (
      <Tab eventKey={4} title={languageDictionary.userProfileTabTitle || 'Profile'}>
        <UserProfile loading={user.get('loading')} user={user.get('record')} error={user.get('error')} languageDictionary={languageDictionary} />
      </Tab>
    );

  }

  render() {
    const { user, databaseConnections, log, logs, devices, settings, languageDictionary } = this.props;
    const userFields = (settings && settings.userFields) || [];
    const suppressRawData = settings && settings.suppressRawData === true;

    return (
      <div className="user">
        <TabsHeader role={this.props.accessLevel.role} languageDictionary={languageDictionary} />
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">{languageDictionary.userTitle || 'User Details'}</h2>
            <div className="pull-right">
              <UserActions
                user={user}
                userFields={userFields}
                databaseConnections={databaseConnections}
                deleteUser={this.props.requestDeleteUser}
                changeFields={this.props.requestFieldsChange}
                resetPassword={this.props.requestPasswordReset}
                changePassword={this.props.requestPasswordChange}
                removeMfa={this.props.requestRemoveMultiFactor}
                blockUser={this.props.requestBlockUser}
                unblockUser={this.props.requestUnblockUser}
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
            <UserHeader loading={user.get('loading')} user={user.get('record')} error={user.get('error')} userFields={userFields} languageDictionary={languageDictionary} />
          </div>
        </div>
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false} id="user-info-tabs">
              <Tab eventKey={1} title={languageDictionary.userUserInfoTabTitle || 'User Information'}>
                <UserInfo
                  loading={user.get('loading')} user={user.get('record')}
                  memberships={user.get('memberships') && user.get('memberships').toJSON()}
                  userFields={userFields}
                  error={user.get('error')}
                  languageDictionary={languageDictionary}
                />
              </Tab>
              <Tab eventKey={2} title={languageDictionary.userDevicesTabTitle || 'Devices'}>
                <UserDevices
                  loading={devices.get('loading')} devices={devices.get('records')}
                  languageDictionary={languageDictionary}
                  error={devices.get('error')}
                />
              </Tab>
              <Tab eventKey={3} title={languageDictionary.userLogsTabTitle || 'Logs'}>
                <LogDialog
                  onClose={this.props.clearLog} error={log.get('error')}
                  loading={log.get('loading')} log={log.get('record')}
                  languageDictionary={languageDictionary}
                  logId={log.get('logId')}
                />
                <LogsTable
                  onOpen={this.props.fetchLog} loading={logs.get('loading')}
                  logs={logs.get('records')}
                  languageDictionary={languageDictionary}
                  error={logs.get('error')}
                  settings={this.props.settings}
                />
              </Tab>
              { this.renderProfile(suppressRawData, user, languageDictionary) }
            </Tabs>
          </div>
        </div>
        <dialogs.DeleteDialog />
        <dialogs.FieldsChangeDialog getDictValue={this.props.getDictValue} userFields={userFields} />
        <dialogs.EmailChangeDialog />
        <dialogs.PasswordResetDialog />
        <dialogs.PasswordChangeDialog />
        <dialogs.UsernameChangeDialog />
        <dialogs.ResendVerificationEmailDialog />
        <dialogs.BlockDialog />
        <dialogs.UnblockDialog />
        <dialogs.RemoveMultiFactorDialog />
      </div>
    );
  }
});
