import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Pagination, TableTotals } from 'auth0-extension-ui';

import { connectionActions, userActions } from '../../actions';

import * as dialogs from './Dialogs';
import TabsHeader from '../../components/TabsHeader';
import { UserOverview, UserForm } from '../../components/Users';

import './Users.css';

class Users extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    users: PropTypes.array,
    connections: PropTypes.array,
    userCreateError: PropTypes.string,
    userCreateLoading: PropTypes.bool,
    validationErrors: PropTypes.object,
    accessLevel: PropTypes.object,
    appSettings: PropTypes.object,
    total: PropTypes.number,
    fetchUsers: PropTypes.func.isRequired,
    getDictValue: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    fetchConnections: PropTypes.func.isRequired,
    requestCreateUser: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    sortOrder: React.PropTypes.number.isRequired,
    sortProperty: React.PropTypes.string.isRequired
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

  onPageChange = (page) => {
    this.props.fetchUsers('', false, page - 1);
  }

  onSearch = (query, filterBy) => {
    if (query && query.length > 0) {
      this.props.fetchUsers(query, false, 0, filterBy);
    }
  }

  onReset = () => {
    this.props.fetchUsers('', true);
  }

  createUser = () => {
    this.props.requestCreateUser(
      this.props.accessLevel.get('record').get('memberships') && this.props.accessLevel.get('record').get('memberships').toJS()
    );
  }

  onColumnSort = (sort) => {
    this.props.fetchUsers('', false, 0, null, sort);
  }

  render() {
    const {
      loading,
      error,
      users,
      total,
      connections,
      userCreateError,
      userCreateLoading,
      accessLevel,
      nextPage,
      pages,
      settings,
      sortProperty,
      sortOrder
    } = this.props;

    const userFields = (settings && settings.userFields) || [];

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
        <dialogs.CreateDialog getDictValue={this.props.getDictValue} userFields={userFields} />
        <UserOverview
          onReset={this.onReset}
          onSearch={this.onSearch}
          onPageChange={this.onPageChange}
          error={error}
          users={users}
          total={total}
          nextPage={nextPage}
          pages={pages}
          loading={loading}
          role={accessLevel.role}
          userFields={userFields}
          sortProperty={sortProperty}
          sortOrder={sortOrder}
          onColumnSort={this.onColumnSort}
        />
        <div className="row">
          <div className="col-xs-12">
            {pages > 1 ?
              <Pagination
                totalItems={total}
                handlePageChange={this.onPageChange}
                perPage={10}
              /> :
              <TableTotals currentCount={users.length} totalCount={total} />
            }            
          </div>
        </div>
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
    nextPage: state.users.get('nextPage'),
    pages: state.users.get('pages'),
    sortProperty: state.users.get('sortProperty'),
    sortOrder: state.users.get('sortOrder'),
    settings: state.settings.get('record').toJS().settings
  };
}

export default connect(mapStateToProps, { ...connectionActions, ...userActions })(Users);
