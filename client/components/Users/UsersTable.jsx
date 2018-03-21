import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  Table,
  TableCell,
  TableRouteCell,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from 'auth0-extension-ui';

import './UserTable.styles.css';
import { getValueForType } from '../../utils/display';

export default class UsersTable extends Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    userFields: PropTypes.array.isRequired,
    onColumnSort: PropTypes.func.isRequired,
    sortOrder: PropTypes.number.isRequired,
    sortProperty: PropTypes.string.isRequired,
    languageDictionary: PropTypes.object
  };

  getListFields(props) {
    const { userFields } = props;
    const defaultListFields = [
      {
        listOrder: 0,
        listSize: '6%',
        property: 'picture',
        label: '',
        display: (user) => user.picture || '',
        search: {
          sort: true
        }
      },
      {
        listOrder: 0,
        listSize: '20%',
        property: 'name',
        label: 'Name',
        display: (user) => (user.nickname || user.email || user.user_id),
        search: {
          sort: true
        }
      },
      {
        listOrder: 1,
        listSize: '29%',
        property: 'email',
        label: 'Email',
        display: (user) => user.email || 'N/A'
      },
      {
        listOrder: 2,
        listSize: '15%',
        property: 'last_login_relative',
        sortProperty: 'last_login',
        label: 'Latest Login',
        search: {
          sort: true
        }
      },
      {
        listOrder: 3,
        listSize: '15%',
        property: 'logins_count',
        label: 'Logins',
        search: {
          sort: true
        }
      }
    ];

    const connectionField = _.find(userFields, { property: 'connection' });
    if (!connectionField) {
      defaultListFields.push({
        listOrder: 4,
        listSize: '25%',
        property: 'identities',
        label: 'Connection',
        display: (user) => user.identities[0].connection
      });
    } else if (_.isFunction(connectionField.display) || (_.isBoolean(connectionField.display) && connectionField.display === true)) {
      defaultListFields.push({
        listOrder: 4,
        listSize: '25%',
        property: 'identities',
        label: 'Connection',
        display: (user) => (_.isFunction(connectionField.display) ? connectionField.display(user) : user.identities[0].connection)
      });
    }

    let listFields = defaultListFields;

    // Apply some customization
    if (userFields.length > 0) {
      // Figure out if we have any user list fields
      const customListFields = _(userFields)
        .filter(field => _.isObject(field.search) || (_.isBoolean(field.search) && field.search === true))
        .map((field) => {
          if (_.isBoolean(field.search) && field.search === true) {
            const defaultField = Object.assign({}, field, {
              listOrder: 1000,
              listSize: '25%'
            });
            return defaultField;
          }

          const customField = Object.assign({}, field, field.search);
          return customField;
        })
        .value();

      // If we do, allow the userFields to override the existing search fields
      if (Array.isArray(customListFields) && customListFields.length > 0) {
        // First filter out defaultListFields from userField entries
        const customFieldProperties = _(userFields)
          .filter(field => _.isObject(field.search) || (_.isBoolean(field.search) && field.search === true))
          .map('property')
          .value();

        listFields = _(defaultListFields)
          .filter(field => customFieldProperties.indexOf(field.property) < 0)
          .concat(customListFields)
          .sortBy(field => field.listOrder)
          .filter(field => field.display !== false) // Remove any fields that have display set to false
          .value();
      }

      /* Now filter out any fields that are set to search === false, this should kill custom fields that are
       * overriding default fields
       */
      const falseSearchFields = _(userFields)
        .filter(field => field.search === false)
        .map('property')
        .value();

      listFields = _(listFields)
        .filter(field => falseSearchFields.indexOf(field.property) < 0)
        .value();
    }

    return listFields;
  }

  constructor(props) {
    super(props);

    const listFields = this.getListFields(props);

    this.state = {
      listFields
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.userFields, nextProps.userFields)) {
      const listFields = this.getListFields(nextProps);

      this.setState({
        listFields
      });
    }
  }

  onColumnSort(property, sortOrder) {
    const sort = {
      property,
      order: sortOrder === -1 ? 1 : -1
    };
    this.props.onColumnSort(sort);
  }

  returnToSearch(event) {
    if (event && event.key === 'Enter') {
      event.target.click();
    }
  }

  render() {
    const { users, loading, sortProperty, sortOrder } = this.props;

    const languageDictionary = this.props.languageDictionary || {};
    const labels = languageDictionary.labels || {};

    const listFields = this.state.listFields;

    if (!users.length && !loading) {
      return (
        <label className="user-search-no-results" tabIndex="0" htmlFor="search-bar" onKeyUp={this.returnToSearch}>
          {languageDictionary.userSearchNoResults || 'No users found by given parameters.'}
        </label>
      );
    }

    return (
      <Table>
        <TableHeader>
          {
            listFields.map((field) => {
              const sort = _.isObject(field.search)
                && (_.isBoolean(field.search.sort) && field.search.sort === true);
              if (sort) {
                return (
                  <TableColumn key={field.property} width={field.listSize}>
                    <div className="table-column-div"
                         onClick={this.onColumnSort.bind(this, field.sortProperty || field.property, sortOrder)}>
                      {labels[field.property] || field.label}
                      {((field.sortProperty || field.property) === sortProperty) &&
                      <i className={sortOrder === -1 ? 'icon-budicon-462 icon' : 'icon-budicon-460 icon'}
                         aria-hidden="true"/>}
                    </div>
                  </TableColumn>
                );
              }

              return (
                <TableColumn key={field.property} width={field.listSize}>
                  {labels[field.property] || field.label}
                </TableColumn>
              );
            })
          }
        </TableHeader>
        <TableBody>
          {users.map(user =>
            <TableRow key={user.user_id}>
              {
                listFields.map((field, index) => {
                  const key = `${user.user_id}_${field.property}`;
                  if (field.property === 'picture') {
                    return (
                      <TableCell>
                        <img
                          className="img-circle"
                          src={getValueForType('search', user, field, languageDictionary) || '(empty)'}
                          alt={user.name || user.user_name || user.email}
                          title={user.name || user.user_name || user.email}
                          width="32"
                        />
                      </TableCell>
                    );
                  }
                  if (field.property === 'name') {
                    return (
                      <TableRouteCell key={key} route={`/users/${user.user_id}`}>
                        {getValueForType('search', user, field, languageDictionary) || '(empty)'}
                      </TableRouteCell>
                    );
                  }
                  return <TableTextCell key={key}>{getValueForType('search', user, field, languageDictionary)}</TableTextCell>;
                })
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }
}
