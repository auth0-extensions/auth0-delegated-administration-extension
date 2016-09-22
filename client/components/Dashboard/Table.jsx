import React, { Component } from 'react';

export default class Table extends Component {
  render() {
    return (
      <table className="table data-table" style={{ tableLayout: 'fixed' }}>
        {this.props.children}
      </table>
    );
  }
}
