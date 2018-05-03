import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SearchBar extends Component {
  static propTypes = {
    enabled: PropTypes.bool.isRequired,
    onReset: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    languageDictionary: PropTypes.object,
    inputId: PropTypes.string
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(findDOMNode(this.refs.search).value);
    }
  }

  onResetSearch = () => {
    findDOMNode(this.refs.search).value = '';
    this.props.onReset();
  }

  renderInstructions = (searchBarInstructions) => {
    if (searchBarInstructions) {
      return (
        <div className="help-block">{searchBarInstructions}</div>
      );
    }

    return (
      <div className="help-block">
        To perform your search, press <span className="keyboard-button">enter</span>.
        You can also search for specific fields, eg: <strong>email:"john@doe.com"</strong>.
      </div>
    );
  };

  render() {
    const languageDictionary = this.props.languageDictionary || {};
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="advanced-search-control">
            <span className="search-area">
              <i className="icon-budicon-489"></i>
              <input
                className="user-input" type="text" ref="search"
                placeholder={languageDictionary.searchBarPlaceholder || 'Search for users using the Lucene syntax'}
                spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={this.onKeyPress} id={this.props.inputId || ''}
              />
            </span>
            <span className="controls pull-right">
              <button onClick={this.onResetSearch} type="reset" disabled={!this.props.enabled}>
                {languageDictionary.searchBarReset || 'Reset'} <i className="icon-budicon-471"></i>
              </button>
            </span>
          </div>
        </div>
        <div className="col-xs-12">
          {this.renderInstructions(languageDictionary.searchBarInstructions)}
        </div>
      </div>
    );
  }
}
