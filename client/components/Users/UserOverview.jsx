import React from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';

import { LuceneSearchBar, UsersTable } from './';
import { Error, LoadingPanel, TableTotals, SearchBar } from 'auth0-extension-ui';

export default class UserOverview extends React.Component {
  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    onPageChange: React.PropTypes.func.isRequired,
    error: React.PropTypes.object,
    users: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired,
    userFields: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    const searchUserFields = _.filter(this.props.userFields, { search: true });
    this.searchOptions = _.map(searchUserFields, (field, index) => {
      return {
        title: field.label,
        value: field.property,
        filterBy: field.property,
        selected: index === 0
      };
    });

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
    const loading = this.props.loading;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={this.props.error}/>
          </div>
        </div>  
        <div className="row">
          <div className="col-xs-12">
            { (this.searchOptions && this.searchOptions.length > 0) ? (
              <SearchBar
                onReset={this.props.onReset}
                enabled={!loading}
                handleKeyPress={this.onKeyPress}
                handleReset={this.onReset}
                handleOptionChange={this.onHandleOptionChange}
                searchOptions={this.searchOptions}
                searchValue={this.state.searchValue} />
            ) : (
              <LuceneSearchBar
                onReset={this.props.onReset}
                onSearch={this.props.onSearch}
                enabled={!loading} />
            )}
          </div>
        </div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12">
              <UsersTable loading={loading} users={this.props.users} userFields={this.props.userFields} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
