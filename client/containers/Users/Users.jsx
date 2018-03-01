import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Pagination, TableTotals } from 'auth0-extension-ui';

import { connectionActions, userActions } from '../../actions';

import * as dialogs from './Dialogs';
import TabsHeader from '../../components/TabsHeader';
import UserOverview from '../../components/Users/UserOverview';

import './Users.styles.css';

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
    total: PropTypes.number,
    fetchUsers: PropTypes.func.isRequired,
    getDictValue: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    fetchConnections: PropTypes.func.isRequired,
    requestCreateUser: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    sortOrder: PropTypes.number.isRequired,
    sortProperty: PropTypes.string.isRequired,
    languageDictionary: PropTypes.object.isRequired
  };

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
  };

  onSearch = (query, filterBy) => {
    if (query && query.length > 0) {
      this.props.fetchUsers(query, false, 0, filterBy);
    }
  };

  onReset = () => {
    this.props.fetchUsers('', true);
  };

  createUser = () => {
    this.props.requestCreateUser(
      this.props.accessLevel.get('record').get('memberships') && this.props.accessLevel.get('record').get('memberships').toJS()
    );
  };

  onColumnSort = (sort) => {
    this.props.fetchUsers('', false, 0, null, sort);
  };

  render() {
    const {
      loading,
      error,
      users,
      total,
      connections,
      accessLevel,
      nextPage,
      pages,
      settings,
      sortProperty,
      sortOrder,
      languageDictionary
    } = this.props;

    const userFields = (settings && settings.userFields) || [];
    const role = accessLevel.get('record').get('role');

    return (
      <div className="users">
        <TabsHeader
          languageDictionary={languageDictionary}
          role={role} />
        <div className="row content-header">
          <div className="col-xs-12 user-table-content">
            <h1>{languageDictionary.usersTitle || 'Users'}</h1>
            {(connections.length && role > 0) ?
              <button id="create-user-button" className="btn btn-success pull-right new" onClick={this.createUser}>
                <i className="icon-budicon-473"></i>
                {languageDictionary.createUserButtonText || 'Create User'}
              </button>
              : ''}
          </div>
        </div>
        <dialogs.CreateDialog getDictValue={this.props.getDictValue} userFields={userFields} errorTranslator={settings && settings.errorTranslator} />
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
          settings={settings}
          languageDictionary={languageDictionary}
        />
        <div className="row">
          <div className="col-xs-12">
            {pages > 1 ?
              <Pagination
                totalItems={total}
                handlePageChange={this.onPageChange}
                perPage={10}
                textFormat={languageDictionary.paginationTextFormat}
              /> :
              <TableTotals currentCount={users.length} totalCount={total} textFormat={languageDictionary.tableTotalsTextFormat} />
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
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary.get('record').toJS()
  };
}

const UsersContainer = connect(mapStateToProps, { ...connectionActions, ...userActions })(Users);

export default UsersContainer;
