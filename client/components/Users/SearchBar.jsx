import { findDOMNode } from 'react-dom';
import React, { PropTypes, Component } from 'react';

export default class SearchBar extends Component {
  static propTypes = {
    enabled: PropTypes.bool.isRequired,
    onReset: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
  };

  onKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.onSearch(findDOMNode(this.refs.search).value);
    }
  };

  onResetSearch = () => {
    findDOMNode(this.refs.search).value = '';
    this.props.onReset();
  };

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="advanced-search-control">
            <span className="search-area">
              <i className="icon-budicon-489"></i>
              <input
                className="user-input" type="text" ref="search" placeholder="Search for users using the Lucene syntax"
                spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={this.onKeyPress}
              />
            </span>
            <span className="controls pull-right">
              <button onClick={this.onResetSearch} type="reset" disabled={!this.props.enabled}>
                Reset <i className="icon-budicon-471"></i>
              </button>
            </span>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="help-block">
            To perform your search, press <span className="keyboard-button">enter</span>.
            You can also search for specific fields, eg: <strong>email:"john@doe.com"</strong>.
          </div>
        </div>
      </div>
    );
  }
}
