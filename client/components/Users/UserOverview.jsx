import React from 'react';
import { findDOMNode } from 'react-dom';

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

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(findDOMNode(this.refs.search).value);
    }
  }

  constructor() {
    super();
    this.renderSearchBar.bind(this);
  }

  renderSearchBar(searchOptions) {
    const loading = this.props.loading;
    if (searchOptions && searchOptions.length > 0) {
      const handleOptionChange = option => console.log("Carlos, option: ", option);

      return <SearchBar
        onReset={this.props.onReset}
        onSearch={this.props.onSearch}
        enabled={!loading}
        handleOptionChange={handleOptionChange}
        searchOptions={searchOptions}/>
    }

    return <LuceneSearchBar
      onReset={this.props.onReset}
      onSearch={this.props.onSearch}
      enabled={!loading}/>
  }

  render() {
    const { loading, error, users, userFields } = this.props;

    const searchOptions = _.map(userFields, (field) => {
      return {
        title: field.label,
        value: field.attribute,
        selected: field.searchBarOptionDefault };
    } );

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error}/>
            </div>
          </div>
          { this.renderSearchBar(searchOptions) }
          <div className="row">
            <div className="col-xs-12">
              <UsersTable loading={loading} users={users} userFields={userFields} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}
