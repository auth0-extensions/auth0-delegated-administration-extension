import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import { Error, LoadingPanel, TableTotals, SearchBar } from 'auth0-extension-ui';

import { LuceneSearchBar, UsersTable } from './';
import getErrorMessage from '../../utils/getErrorMessage';
import { getFilterableUserFields } from '../../utils/userSearchParams';

import './UserOverview.styles.css';

export default class UserOverview extends React.Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    error: PropTypes.object,
    users: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    userFields: PropTypes.array.isRequired,
    onColumnSort: PropTypes.func.isRequired,
    sortOrder: PropTypes.number.isRequired,
    searchValue: PropTypes.string,
    selectedFilter: PropTypes.string,
    sortProperty: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.searchOptions = getFilterableUserFields(this.props.userFields);

    this.defaultFilter = this.searchOptions[0];
    this.state = {
      searchValue: this.props.searchValue,
      selectedFilter: this.getSelectedFilterOption(this.props.selectedFilter),
      // auth0-extension-ui SearchBar only reads searchValue or selectedFilter props on mount.
      // when the user clicks [Reset] button, the searchValue and selectedFilter are reset,
      // but SearchBar ignores it and keeps the previous value. So we need to force a re-render.
      // Here's a simple auto-incrementing key to force a re-render when searchValue or selectedFilter change
      searchBarKey: 0
    };

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onHandleOptionChange = this.onHandleOptionChange.bind(this);
  }

  getSelectedFilterOption = (filterBy) => {
    if (!filterBy) {
      return this.defaultFilter;
    }

    return _.find(this.searchOptions, { filterBy }) || this.defaultFilter;
  };

  componentWillReceiveProps(nextProps) {
    const updates = {};

    // Sync URL/Redux-driven search and filter into local state after mount.
    if (nextProps.searchValue !== this.props.searchValue) {
      updates.searchValue = nextProps.searchValue;
    }
    if (nextProps.selectedFilter !== this.props.selectedFilter) {
      updates.selectedFilter = this.getSelectedFilterOption(nextProps.selectedFilter);
    }

    if (Object.keys(updates).length > 0) {
      // auth0-extension-ui SearchBar only reads searchValue/selectedFilter on mount.
      this.setState((prevState) => ({
        ...updates,
        searchBarKey: prevState.searchBarKey + 1
      }));
    }
  }

  onSearch = (query, filter) => {
    this.props.onSearch(query, filter, this.focusSearchResults);
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = e.target.value;
      this.onSearch(query, this.state.selectedFilter.filterBy);
    }
  }


  onReset() {
    this.props.onReset();
    this.setState((prevState) => ({
      searchValue: '',
      selectedFilter: this.defaultFilter,
      searchBarKey: prevState.searchBarKey + 1
    }));
  }

  onHandleOptionChange(option) {
    this.setState({
      selectedFilter: option
    });
  }

  focusSearchResults = () => {
    const searchResults = findDOMNode(this.refs.searchResults);
    const element = searchResults.querySelector('a') || searchResults.querySelector('label');
    element.focus();
  };

  render() {
    const { loading, sortProperty, sortOrder, error, settings } = this.props;
    const languageDictionary = this.props.languageDictionary || {};
    const labels = languageDictionary.labels || {};

    const searchOptions = this.searchOptions.map((option) => ({
      ...option,
      title: labels[option.value] || option.title || option.value,
      selected: option.filterBy === this.state.selectedFilter.filterBy
    }));

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error
              title={languageDictionary.errorTitle}
              message={
                // Client-side search validation errors use a plain message; API errors go through getErrorMessage.
                error && error.searchValidation
                  ? error.message
                  : getErrorMessage(languageDictionary, error, settings.errorTranslator)
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <label className="hidden-label" htmlFor="search-bar">
              {languageDictionary.searchBarPlaceholder || 'Search for users using the Lucene syntax'}
            </label>

            {(searchOptions.length > 0) ? (
              <SearchBar
                key={this.state.searchBarKey}
                inputId="search-bar"
                onReset={this.props.onReset}
                enabled={!loading}
                handleKeyPress={this.onKeyPress}
                handleReset={this.onReset}
                handleOptionChange={this.onHandleOptionChange}
                searchOptions={searchOptions}
                searchValue={this.state.searchValue}
                placeholder={languageDictionary.searchBarPlaceholder}
                resetButtonText={languageDictionary.searchBarReset}
                instructionsText={languageDictionary.searchBarInstructions}
              />
              ) : (
                <LuceneSearchBar
                  inputId="search-bar"
                  onReset={this.props.onReset}
                  onSearch={this.onSearch}
                  searchValue={this.state.searchValue}
                  enabled={!loading}
                  languageDictionary={languageDictionary}
                />
              )}
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12" ref="searchResults">
              <UsersTable loading={loading} users={this.props.users}
                          userFields={this.props.userFields} onColumnSort={this.props.onColumnSort}
                          sortOrder={sortOrder} sortProperty={sortProperty}
                          languageDictionary={languageDictionary}/>
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
