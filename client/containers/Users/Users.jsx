import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { LoadingPanel, Pagination, TableTotals } from 'auth0-extension-ui';

import { connectionActions, userActions } from '../../actions';

import * as dialogs from './Dialogs';
import TabsHeader from '../../components/TabsHeader';
import UserOverview from '../../components/Users/UserOverview';
import { getFilterableUserFields, validateLuceneQuery } from '../../utils/userSearchParams';

import './Users.styles.css';

class Users extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    connectionsLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    users: PropTypes.array,
    connections: PropTypes.array,
    userCreateError: PropTypes.string,
    userCreateLoading: PropTypes.bool,
    validationErrors: PropTypes.object,
    accessLevel: PropTypes.object,
    total: PropTypes.number,
    fetchUsers: PropTypes.func.isRequired,
    clearUsers: PropTypes.func.isRequired,
    getDictValue: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    fetchConnections: PropTypes.func.isRequired,
    requestCreateUser: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    settingsLoading: PropTypes.bool.isRequired,
    sortOrder: PropTypes.number.isRequired,
    sortProperty: PropTypes.string.isRequired,
    searchValue: PropTypes.string,
    selectedFilter: PropTypes.string,
    languageDictionary: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showCreateForm: false,
      urlSearchValidationError: null
    };
  }

  componentWillMount = () => {
    if (!this.props.connectionsLoading) {
      this.props.fetchConnections();
    }
    // At the time, when this component mounts first, the settings may not be loaded yet.
    // The userFields (from settings) determine the search mode.
    // So, let's defer prefetch until they are loaded.
    if (!this.props.settingsLoading) {
      this.prefetchUsers();
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.settingsLoading && !this.props.settingsLoading) {
      this.prefetchUsers();
    }
  };

  onPageChange = (page) => {
    this.props.fetchUsers('', false, page - 1);
  };

  onSearch = (query, filterBy, onSuccess) => {
    if (query && query.length > 0) {
      this.setState({ urlSearchValidationError: null });
      this.updateSearchInUrl(query, filterBy);
      this.props.fetchUsers(query, false, 0, filterBy, null, onSuccess);
    }
  };

  onReset = () => {
    this.setState({ urlSearchValidationError: null });
    this.updateSearchInUrl('', '');
    this.props.fetchUsers('', true);
  };

  getUserFields = () => this.props.settings?.userFields || [];

  prefetchUsers = () => {
    // The concept:
    // - The URL may provide the initial search query and filterBy field, when valid it's used to as the initial search query and filterBy field in the Redux state
    // - As the user updates the search query and filterBy field, the changes first are reflected in the Redux state and the URL just mirrors the changes
    const { searchValue, selectedFilter } = this.props;
    const resolvedFromUrl = this.readSearchTermsFromUrl();

    if (!resolvedFromUrl.valid) {
      // Keep URL params visible; show validation error; do not search or show stale results.
      this.setState({ urlSearchValidationError: resolvedFromUrl.error });
      this.props.clearUsers();
      return;
    }

    if (resolvedFromUrl.search) {
      // Search term is present in the URL, so it takes precedence over the Redux state
      let { search, filterBy } = resolvedFromUrl;
      this.setState({ urlSearchValidationError: null });
      this.updateSearchInUrl(search, filterBy);
      this.props.fetchUsers(search, false, 0, filterBy);
    } else if (searchValue) {
      // Search term is present in the Redux state, let's use it and reflect it in the URL
      this.setState({ urlSearchValidationError: null });
      this.updateSearchInUrl(searchValue, selectedFilter);
      this.props.fetchUsers(searchValue, false, 0, selectedFilter);
    } else {
      // No search term is present, let's do the initial fetch without any search terms
      this.setState({ urlSearchValidationError: null });
      this.props.fetchUsers();
    }
  };

  updateSearchInUrl = (search, filterBy) => {
    const trimmedSearch = typeof search === 'string' ? search.trim() : '';
    this.props.replace({
      pathname: '/users',
      query: {
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        ...(filterBy ? { filterBy } : {})
      }
    });
  };

  readSearchTermsFromUrl() {
    const { search, filterBy } = this.props.location?.query || {};
    const userFields = this.getUserFields();
    const trimmedSearch = typeof search === 'string' ? search.trim() : '';

    // This is a subtle security consideration.
    //
    // The Auth0 Management API is the authoritative source for validating the query syntax,
    // so we rely on it to validate the query syntax and show the user the error message if any.
    //
    // Previously, search queries could only originate from the application's interactive search
    // input. While malformed or intentionally malicious queries were still possible, they however
    // required a deliberate user action within the application (and could not be injected externally),
    // which used to lower the risk of exploitation due to the user's awareness.
    //
    // Introducing support for supplying the search query via the URL changes the trust boundary.
    // URL parameters are untrusted input and may be crafted or manipulated by a malicious actor
    // (e.g. through a shared or embedded link), allowing invalid or malicious queries to reach
    // the API without any deliberate user input/awareness.
    //
    // To reduce this attack surface, the client-side performs proactive validation before sending
    // the query to the backend. This acts as an additional defensive layer while the backend (with the
    // underlying Auth0 Management API) remains the ultimate authority for query validation.
    //
    const filterableFields = getFilterableUserFields(userFields);
    // Two search modes: filterable userFields => plain field value + filterBy dropdown;
    // otherwise free-text must be valid Lucene (see LuceneSearchBar vs auth0-extension-ui SearchBar).
    if (filterableFields.length > 0) {
      const validFieldName = filterableFields.some((field) => field.filterBy === filterBy);
      if (trimmedSearch && !filterBy) {
        return {
          valid: false,
          error: 'Filter field is required when search term is present in the URL',
          search: trimmedSearch,
          filterBy
        };
      }
      if (filterBy && !validFieldName) {
        return {
          valid: false,
          error: 'Unsupported filter field in the URL "' + filterBy + '"',
          search: trimmedSearch,
          filterBy
        };
      }
      return { valid: true, search: trimmedSearch, filterBy: validFieldName ? filterBy : '' };
    }
    // now we expect a Lucene query only (no filterBy)

    if (!trimmedSearch) {
      return { valid: true, search: '', filterBy: '' };
    }

    const luceneResult = validateLuceneQuery(trimmedSearch);
    if (!luceneResult.valid) {
      return { valid: false, error: luceneResult.error, search: trimmedSearch, filterBy: '' };
    }

    return { valid: true, search: trimmedSearch, filterBy: '' };
  }

  createUser = () => {
    this.props.requestCreateUser(
      this.props.accessLevel.get('record').get('memberships') &&
        this.props.accessLevel.get('record').get('memberships').toJS()
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
      connectionsLoading,
      accessLevel,
      nextPage,
      pages,
      settings,
      sortProperty,
      sortOrder,
      searchValue,
      selectedFilter,
      languageDictionary,
      settingsLoading
    } = this.props;
    const { urlSearchValidationError } = this.state;

    const userFields = this.getUserFields();
    const showCreateUser = settings.canCreateUser !== undefined ? settings.canCreateUser: true;
    const role = accessLevel.get('record').get('role');
    const originalTitle = (settings.dict && settings.dict.title) || window.config.TITLE || 'User Management';
    document.title = `${languageDictionary.userUsersTabTitle || 'Users'} - ${originalTitle}`;

    return (
      <div className="users">
        <TabsHeader
          languageDictionary={languageDictionary}
          role={role} />
        <div className="row content-header">
          <div className="col-xs-12 user-table-content">
            <h1>{languageDictionary.usersTitle || 'Users'}</h1>
            {( !connectionsLoading && role > 0 && showCreateUser) ?
              <button id="create-user-button" className="btn btn-success pull-right new" onClick={this.createUser}>
                <i className="icon-budicon-473"></i>
                {languageDictionary.createUserButtonText || 'Create User'}
              </button>
              : ''}
          </div>
        </div>
        <dialogs.CreateDialog getDictValue={this.props.getDictValue} userFields={userFields} errorTranslator={settings && settings.errorTranslator} />
        {!settingsLoading ? (
          <UserOverview
            onReset={this.onReset}
            onSearch={this.onSearch}
            onPageChange={this.onPageChange}
            error={urlSearchValidationError ? { searchValidation: true, message: urlSearchValidationError } : error}
            users={users}
            total={total}
            nextPage={nextPage}
            pages={pages}
            loading={loading}
            role={accessLevel.role}
            userFields={userFields}
            sortProperty={sortProperty}
            sortOrder={sortOrder}
            searchValue={searchValue}
            selectedFilter={selectedFilter}
            onColumnSort={this.onColumnSort}
            settings={settings}
            languageDictionary={languageDictionary}
          />
        ) : (
          <LoadingPanel show>
            <div />
          </LoadingPanel>
        )}
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
    connectionsLoading: state.connections.get('loading'),
    total: state.users.get('total'),
    nextPage: state.users.get('nextPage'),
    pages: state.users.get('pages'),
    sortProperty: state.users.get('sortProperty'),
    sortOrder: state.users.get('sortOrder'),
    searchValue: state.users.get('searchValue'),
    selectedFilter: state.users.get('selectedFilter'),
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    settingsLoading: state.settings.get('loading'),
    languageDictionary: state.languageDictionary.get('record').toJS()
  };
}

const UsersContainer = connect(mapStateToProps, { ...connectionActions, ...userActions, replace })(Users);

export default UsersContainer;
