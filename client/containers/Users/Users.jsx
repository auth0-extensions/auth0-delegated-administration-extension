import React, { Component } from 'react';
import { connect } from 'react-redux';

import { connectionActions, userActions } from '../../actions';


import * as dialogs from './Dialogs';
import TabsHeader from '../../components/TabsHeader';
import { UserOverview, UserForm } from '../../components/Users';

import './Users.css';

class Users extends Component {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
    error: React.PropTypes.string,
    users: React.PropTypes.array,
    connections: React.PropTypes.array,
    userCreateError: React.PropTypes.string,
    userCreateLoading: React.PropTypes.bool,
    validationErrors: React.PropTypes.object,
    accessLevel: React.PropTypes.object,
    appSettings: React.PropTypes.object,
    total: React.PropTypes.number,
    fetchUsers: React.PropTypes.func.isRequired,
    getDictValue: React.PropTypes.func.isRequired,
    createUser: React.PropTypes.func.isRequired,
    fetchConnections: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      showCreateForm: false
    };
  }

  componentWillMount = () => {
    this.props.fetchUsers();
    this.props.fetchConnections();
  };

  onSearch = (query) => {
    this.props.fetchUsers(query);
  }

  onReset = () => {
    this.props.fetchUsers('', true);
  }

  createUser = () => {
    this.props.requestCreateUser(this.props.accessLevel.get('record').get('memberships').toJS());
  }

  render() {
    const { loading, error, users, total, connections, userCreateError, userCreateLoading, accessLevel } = this.props;
    return (
      <div className="users">
        <TabsHeader role={accessLevel.get('record').get('role')} />
        <div className="row content-header">
          <div className="col-xs-12 user-table-content">
            <h1>Users</h1>
            {(connections.length) ?
              <button className="btn btn-success pull-right new" onClick={this.createUser}>
                <i className="icon-budicon-473"></i>
                Create User
              </button>
            : ''}
          </div>
        </div>
        <dialogs.CreateDialog getDictValue={this.props.getDictValue} />
        <UserOverview
          onReset={this.onReset}
          onSearch={this.onSearch}
          error={error}
          users={users}
          total={total}
          loading={loading}
          role={accessLevel.role}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessLevel: state.accessLevel,
    error: state.users.get('error'),
    userCreateError: state.userCreate.get('error'),
    userCreateLoading: state.userCreate.get('loading'),
    validationErrors: state.userCreate.get('validationErrors'),
    loading: state.users.get('loading'),
    users: state.users.get('records').toJS(),
    connections: state.connections.get('records').toJS(),
    total: state.users.get('total'),
    nextPage: state.users.get('nextPage')
  };
}

export default connect(mapStateToProps, { ...connectionActions, ...userActions })(Users);
