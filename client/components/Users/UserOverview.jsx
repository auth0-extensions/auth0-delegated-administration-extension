import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import { Error, LoadingPanel, TableTotals, SearchBar } from 'auth0-extension-ui';

import { LuceneSearchBar, UsersTable } from './';
import getErrorMessage from '../../utils/getErrorMessage';
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
    sortProperty: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.searchOptions = _(this.props.userFields)
      .filter(field => _.isObject(field.search) && field.search.filter && field.search.filter === true)
      .map((field, index) => {
        return {
          title: field.label,
          value: field.property,
          filterBy: field.property,
          selected: index === 0
        };
      })
      .value();

    this.defaultFilter = _.find(this.searchOptions, { selected: true });
    this.state = {
      searchValue: '',
      selectedFilter: this.defaultFilter
    };

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onHandleOptionChange = this.onHandleOptionChange.bind(this);
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
    this.setState({
      searchValue: ''
    });
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
    const searchOptions = this.searchOptions.map((option) => {
      option.title = labels[option.value] || option.title || option.value;
      return option;
    });

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <label className="hidden-label" htmlFor="search-bar">
              {languageDictionary.searchBarPlaceholder || 'Search for users using the Lucene syntax'}
            </label>

            {(searchOptions.length > 0) ? (
              <SearchBar
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
