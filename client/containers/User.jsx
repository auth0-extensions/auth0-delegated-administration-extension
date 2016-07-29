import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, MenuItem, DropdownButton, ButtonToolbar } from 'react-bootstrap';

import { logActions, userActions } from '../actions';

import './User.css';
import LogDialog from '../components/Logs/LogDialog';
import UserLogs from '../components/Users/UserLogs';
import UserHeader from '../components/Users/UserHeader';
import UserProfile from '../components/Users/UserProfile';
import UserDevices from '../components/Users/UserDevices';

export default class UserContainer extends Component {
  componentWillMount() {
    this.props.fetchUser(this.props.params.id);
  }

  render() {
    const { user, log, logs, devices } = this.props;

    return (
      <div className="user">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">User Details</h2>
            <div className="pull-right">
              <DropdownButton className="pull-right" bsStyle="success" title="Actions" id="user-actions">
                <MenuItem eventKey="1">Action</MenuItem>
                <MenuItem eventKey="2">Another action</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="4">Separated link</MenuItem>
              </DropdownButton>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <UserHeader loading={user.loading} user={user.record} error={user.error} />
          </div>
        </div>
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Profile">
                <UserProfile loading={user.loading} user={user.record} error={user.error} />
              </Tab>
              <Tab eventKey={3} title="Devices">
                <UserDevices loading={devices.loading} devices={devices.records} error={devices.error} />
              </Tab>
              <Tab eventKey={4} title="Logs">
                <LogDialog onClose={this.props.clearLog} error={log.error} loading={log.loading} log={log.record} logId={log.id} />
                <UserLogs onOpen={this.props.fetchLog} loading={logs.loading} logs={logs.records} user={user.record} error={logs.error} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: {
      record: state.user.get('record'),
      error: state.user.get('error'),
      loading: state.user.get('loading')
    },
    log: {
      id: state.log.get('logId'),
      record: state.log.get('record'),
      error: state.log.get('error'),
      loading: state.log.get('loading')
    },
    logs: {
      records: state.user.get('logs').get('records'),
      error: state.user.get('logs').get('error'),
      loading: state.user.get('logs').get('loading')
    },
    devices: {
      records: state.user.get('devices').get('records'),
      error: state.user.get('devices').get('error'),
      loading: state.user.get('devices').get('loading')
    }
  };
}

export default connect(mapStateToProps, { ...logActions, ...userActions, })(UserContainer);
