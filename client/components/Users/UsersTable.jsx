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
    let display;
    let displayFunction;
    if (typeof field.display === 'function') displayFunction = field.display;
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
        searchListOrder: 0,
        searchListSize: '25%',
        property: 'name',
        label: 'Name',
        display: (user, value) => (value || user.nickname || user.email || user.user_id)
      },
      {
        searchListOrder: 1,
        searchListSize: '29%',
        property: 'email',
        label: 'Email',
        display: (user, value) => value || 'N/A'
      },
      {
        searchListOrder: 2,
        searchListSize: '15%',
        property: 'last_login_relative',
        label: 'Latest Login'
      },
      {
        searchListOrder: 3,
        searchListSize: '10%',
        property: 'logins_count',
        label: 'Logins'
      },
      {
        searchListOrder: 4,
        searchListSize: '25%',
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
        .filter(field => (field.searchListOrder || field.searchListOrder === 0) && field.searchListOrder >= 0)
        .value();

      // If we do, allow the userFields to override the existing search fields
      if (Array.isArray(customListFields) && customListFields.length > 0) {
        // First filter out defaultListFields from userField entries
        const customFieldProperties = _(userFields)
          .filter(field => field.searchListOrder !== undefined)
          .map('property')
          .value();
        listFields = _(defaultListFields)
          .filter(field => customFieldProperties.indexOf(field.property) < 0)
          .concat(customListFields)
          .sortBy(field => field.searchListOrder)
          .value();
      }
    }

    console.log('listFields', listFields);
    console.log('users', users);

    return (
      <Table>
        <TableHeader>
          <TableColumn width="6%" />
          {
            listFields.map((field) => <TableColumn key={field.property} width={field.searchListSize}>{field.label}</TableColumn>)
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
                  if (index === 0) {
                    return <TableRouteCell key={`${user.user_id}_${field.property}`} route={`/users/${user.user_id}`}>
                      { this.getValue(field, user, '(empty)') }
                    </TableRouteCell>;
                  }

                  return <TableTextCell key={`${user.user_id}_${field.property}`} >{this.getValue(field, user)}</TableTextCell>;
                })
              }

            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }
}
