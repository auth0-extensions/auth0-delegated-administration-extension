import React from 'react';

export default class UserPaginator extends React.Component {
  static propTypes = {
    onPageChange: React.PropTypes.func.isRequired,
    nextPage: React.PropTypes.number.isRequired,
    pages: React.PropTypes.number.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return this.props.nextPage !== nextProps.nextPage;
  }

  onPreviousPage = () => {
    this.props.onPageChange(this.props.nextPage - 1);
  }

  onNextPage = () => {
    this.props.onPageChange(this.props.nextPage + 1);
  }
  
  changePage = (page) => {
    this.props.onPageChange(page)
  }

  render() {
    const { nextPage, pages } = this.props;

    return (
      <nav className="pull-right">
        <ul className="pagination pull-right">
          <li
            style={{ cursor: 'pointer' }}
            onClick={() => this.onPreviousPage()}
            className={nextPage - 2 < 0 ? 'disabled' : ''}
          >
            <a>
              <span>&laquo;</span>
            </a>
          </li>
          {[ ...Array(pages) ].map((item, i) => {
            const page = i + 1;
            return (
              <li
                key={i}
                style={{ cursor: 'pointer' }}
                className={nextPage === page ? 'active' : ''}
                onClick={() => this.changePage(page)}
              >
                <a>{page}</a>
              </li>
            );
          })}
          <li
            style={{ cursor: 'pointer' }}
            onClick={() => this.onNextPage()}
            className={nextPage + 1 > pages ? 'disabled' : ''}
          >
            <a>
              <span>&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
