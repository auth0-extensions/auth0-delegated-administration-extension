import React, { Component } from 'react';
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

import { getProperty } from '../../utils';

export default class UsersTable extends Component {
  static propTypes = {
    users: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired,
    userFields: React.PropTypes.array.isRequired
  }

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.users !== this.props.users;
  // }

  getValue(field, user, defaultValue) {
      // First get the value
    let value;
    if (typeof field.property === 'function') value = field.property(user);
    else if (field.property) value = getProperty(user, field.property);

    // Now get the display value
    const displayProperty = field.search && field.search.display ? field.search.display : field.display;
    let display;
    let displayFunction;
    if (typeof displayProperty === 'function') displayFunction = displayProperty;
    if (displayFunction) {
      display = displayFunction(user, value);
    }

    if (!display && typeof value === 'object') {
      display = JSON.stringify(value);
    }

    return display || value || defaultValue;
  }

  render() {
    const { users, userFields } = this.props;

    const defaultListFields = [
      {
        listOrder: 0,
        listSize: '25%',
        property: 'name',
        label: 'Name',
        display: (user, value) => (value || user.nickname || user.email || user.user_id)
      },
      {
        listOrder: 1,
        listSize: '29%',
        property: 'email',
        label: 'Email',
        display: (user, value) => value || 'N/A'
      },
      {
        listOrder: 2,
        listSize: '15%',
        property: 'last_login_relative',
        label: 'Latest Login'
      },
      {
        listOrder: 3,
        listSize: '10%',
        property: 'logins_count',
        label: 'Logins'
      },
      {
        listOrder: 4,
        listSize: '25%',
        property: 'identities',
        label: 'Connection',
        display: (user, value) => value[0].connection
      }
    ];

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
          .value();
      }
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="6%" />
          {
            listFields.map(field => <TableColumn key={field.property} width={field.listSize}>{field.label}</TableColumn>)
          }
        </TableHeader>
        <TableBody>
          {users.map(user =>
            <TableRow key={user.user_id}>
              <TableCell>
                <img className="img-circle" src={user.picture} alt={name} width="32" />
              </TableCell>
              {
                listFields.map((field, index) => {
                  const key = `${user.user_id}_${field.property}`;
                  if (index === 0) {
                    return (
                      <TableRouteCell key={key} route={`/users/${user.user_id}`}>
                        { this.getValue(field, user, '(empty)') }
                      </TableRouteCell>
                    );
                  }
                  return <TableTextCell key={key} >{this.getValue(field, user)}</TableTextCell>;
                })
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }
}
