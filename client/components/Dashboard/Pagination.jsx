import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

class Pagination extends Component {
  handlePageChange(diff) {
    this.props.handlePageChange(this.props.currentPage + diff);
  }

  render() {
    if (this.props.totalItems === 0) return null;

    const pages = Math.ceil(this.props.totalItems / this.props.perPage);

    return (
      <div className="row">
        <div className="col-xs-8">
          Page {this.props.currentPage} of {pages}
        </div>
        <div className="col-xs-4">
          {this.props.currentPage !== pages &&
            <Button bsSize="small" className="pull-right"
              onClick={this.handlePageChange.bind(this, 1)}
            >
              <i className="icon-budicon-175" />
            </Button>
          }

          {this.props.currentPage !== 1 &&
            <Button bsSize="small" className="pull-right"
              onClick={this.handlePageChange.bind(this, -1)}
            >
              <i className="icon-budicon-176" />
            </Button>
          }
        </div>
      </div>
    );
  }
}

Pagination.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired
};

export default Pagination;