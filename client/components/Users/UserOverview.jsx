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

    const selectedFilter = _.find(this.searchOptions, { selected: true });
    this.state = { selectedFilter };

    this.renderSearchBar.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onHandleOptionChange = this.onHandleOptionChange.bind(this);
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = `${this.state.selectedFilter.filterBy}:${e.target.value}*`;
      this.props.onSearch(query);
    }
  }

  onReset() {
    this.props.onReset();
  }

  onHandleOptionChange(option) {
    this.setState({
      selectedFilter: option
    });
  }

  renderSearchBar() {
    const loading = this.props.loading;
    if (this.searchOptions && this.searchOptions.length > 0) {
      return <SearchBar
        placeholder="Search"
        onReset={this.props.onReset}
        enabled={!loading}
        handleKeyPress={this.onKeyPress}
        handleReset={this.onReset}
        handleOptionChange={this.onHandleOptionChange}
        searchOptions={this.searchOptions} />
    }

    return <LuceneSearchBar
      onReset={this.props.onReset}
      onSearch={this.props.onSearch}
      enabled={!loading} />
  }

  render() {
    return (
      <div>
        <LoadingPanel show={this.props.loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={this.props.error}/>
            </div>
          </div>
          { this.renderSearchBar() }
          <div className="row">
            <div className="col-xs-12">
              <UsersTable loading={this.props.loading} users={this.props.users} userFields={this.props.userFields} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
