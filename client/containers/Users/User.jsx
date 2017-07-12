import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Tabs, Tab } from 'react-bootstrap';

import { logActions, userActions } from '../../actions';

import './User.css';

import * as dialogs from './Dialogs';
import TabsHeader from '../../components/TabsHeader';
import LogDialog from '../../components/Logs/LogDialog';
import { UserActions, UserDevices, UserHeader, UserProfile, UserLogs, UserInfo } from '../../components/Users';

import getUserDatabaseConnections from '../../selectors/getUserDatabaseConnections';

export default connectContainer(class extends Component {
  static stateToProps = state => ({
    user: state.user,
    databaseConnections: getUserDatabaseConnections(state),
    log: state.log,
    logs: state.user.get('logs'),
    devices: state.user.get('devices'),
    settings: state.settings
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
    fetchUser: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchUser(this.props.params.id);
  }

  render() {
    const { user, databaseConnections, log, logs, devices } = this.props;
    const { settings } = this.props.settings.get('record').toJS();
    const customFields = (settings && settings.customFields) || [];

    return (
      <div className="user">
        <TabsHeader role={this.props.accessLevel.role} />
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">User Details</h2>
            <div className="pull-right">
              <UserActions
                user={user}
                databaseConnections={databaseConnections}
                deleteUser={this.props.requestDeleteUser}
                resetPassword={this.props.requestPasswordReset}
                changePassword={this.props.requestPasswordChange}
                removeMfa={this.props.requestRemoveMultiFactor}
                blockUser={this.props.requestBlockUser}
                unblockUser={this.props.requestUnblockUser}
                changeUsername={this.props.requestUsernameChange}
                changeEmail={this.props.requestEmailChange}
                resendVerificationEmail={this.props.requestResendVerificationEmail}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <UserHeader loading={user.get('loading')} user={user.get('record')} error={user.get('error')} />
          </div>
        </div>
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false} id="user-info-tabs">
              <Tab eventKey={1} title="User Information">
                <UserInfo
                  loading={user.get('loading')} user={user.get('record')}
                  memberships={user.get('memberships') && user.get('memberships').toJSON()}
                  customFields={customFields}
                  error={user.get('error')}
                />
              </Tab>
              <Tab eventKey={2} title="Devices">
                <UserDevices
                  loading={devices.get('loading')} devices={devices.get('records')} error={devices.get('error')}
                />
              </Tab>
              <Tab eventKey={3} title="Logs">
                <LogDialog
                  onClose={this.props.clearLog} error={log.get('error')}
                  loading={log.get('loading')} log={log.get('record')}
                  logId={log.get('logId')}
                />
                <UserLogs
                  onOpen={this.props.fetchLog} loading={logs.get('loading')}
                  logs={logs.get('records')} user={user.get('record')}
                  error={logs.get('error')}
                />
              </Tab>
              <Tab eventKey={4} title="Profile">
                <UserProfile loading={user.get('loading')} user={user.get('record')} error={user.get('error')} />
              </Tab>
            </Tabs>
          </div>
        </div>
        <dialogs.DeleteDialog />
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
