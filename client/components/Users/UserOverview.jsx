import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { LuceneSearchBar, UsersTable } from './';
import { Error, LoadingPanel, TableTotals, SearchBar } from 'auth0-extension-ui';

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

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = e.target.value;
      this.props.onSearch(query, this.state.selectedFilter.filterBy);
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

  render() {
    const { loading, sortProperty, sortOrder } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={this.props.error}/>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            {(this.searchOptions && this.searchOptions.length > 0) ? (
              <SearchBar
                onReset={this.props.onReset}
                enabled={!loading}
                handleKeyPress={this.onKeyPress}
                handleReset={this.onReset}
                handleOptionChange={this.onHandleOptionChange}
                searchOptions={this.searchOptions}
                searchValue={this.state.searchValue}
                placeholder={this.props.languageDictionary.searchBarPlaceholder}
                resetButtonText={this.props.languageDictionary.searchBarReset}
                instructionsText={this.props.languageDictionary.searchBarInstructions}/>
            ) : (
              <LuceneSearchBar
                onReset={this.props.onReset}
                onSearch={this.props.onSearch}
                enabled={!loading}
                languageDictionary={this.props.languageDictionary}/>
            )}
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12">
              <UsersTable loading={loading} users={this.props.users}
                          userFields={this.props.userFields} onColumnSort={this.props.onColumnSort}
                          sortOrder={sortOrder} sortProperty={sortProperty}
                          languageDictionary={this.props.languageDictionary}/>
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
