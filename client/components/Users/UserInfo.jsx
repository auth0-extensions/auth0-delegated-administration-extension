import _ from 'lodash';
import moment from 'moment';
import React, { PropTypes, Component } from 'react';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import './UserInfo.css';
import UserInfoField from './UserInfoField';
import { getProperty } from '../../utils'

export default class UserInfo extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    memberships: PropTypes.array,
    userFields: PropTypes.array
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user
      || nextProps.memberships !== this.props.memberships
      || nextProps.userFields !== this.props.userFields
      || nextProps.loading !== this.props.loading
      || nextProps.error !== this.props.error;
  }

  getMemberships = (memberships) => {
    const meta = memberships || [];
    return meta.join(', ');
  }

  getIdentities = (user) => {
    if (user.size === 0) return {};
    return user.get('identities').toJSON()[0];
  }

  getBlocked = (user) => {
    if (user.size === 0) return '';
    return user.get('blocked') ? 'Yes' : 'No';
  }

  getValue(user, field) {
    if (user.size === 0) {
      return null;
    }

    let value = getProperty(user, field.property);
    if (value === undefined) return null;

    if (field.type && field.type === 'elapsedTime') {
      value = moment(value).fromNow();
    }

    if (typeof value === 'object') value = Object.toString(value);

    return value;
  }

  render() {
    const { user, error, loading, memberships } = this.props;
    const extraDisplayFields =
      _(this.props.userFields || [])
        .filter(field => field.display)
        .map(field => { return {
          title: field.label,
          property: field.property,
          displayFunction: field.displayFunction };
        })
        .value();

    let nonDisplayFields =
      _(this.props.userFields || [])
        .filter(field => field.display === false)
        .pick('property')
        .value();

    if (typeof nonDisplayFields !== 'array') nonDisplayFields = [];

    const userObject = user.toJS();
    userObject.currentMemberships = this.getMemberships(memberships);
    userObject.identity = this.getIdentities(user);
    userObject.isBlocked = this.getBlocked(user);

    const defaultFieldInfo = [
      { title: 'User ID', property: 'user_id' },
      { title: 'Name', property: 'name' },
      { title: 'Username', property: 'username' },
      { title: 'Email', property: 'email' },
      { title: 'Identity', property: 'identity.connection' },
      { title: 'Blocked', property: 'isBlocked' },
      { title: 'Last IP', property: 'last_ip' },
      { title: 'Logins Count', property: 'logins_count' },
      { title: 'Memberships', property: 'currentMemberships' },
      { title: 'Signed Up', property: 'created_at', type: 'elapsedTime'},
      { title: 'Updated', property: 'updated_at', type: 'elapsedTime' },
      { title: 'Last Login', property: 'last_login', type: 'elapsedTime' }
    ];

    const fieldInfo = _(defaultFieldInfo).concat(extraDisplayFields).value();

    const fieldProperties = _.map(fieldInfo, 'property');
    const excludeFields = _(fieldProperties)
      .concat([ 'identity', 'identities', 'app_metadata', 'picture' ], nonDisplayFields)
      .value();
    const extraFields = _.keys(_.omit(userObject, excludeFields));

    const nonExcludedFields = _.filter(fieldInfo, (field) => nonDisplayFields.indexOf(field.property) < 0);

    const fields = _(nonExcludedFields)
      .concat(_.map(extraFields, (fieldName) => { return { title: fieldName, property: fieldName }}))
      .value();

    const fieldsAndValues = _.map(fields, (field) => { field.value = this.getValue(userObject, field); return field; });
    const nonNullFields = _.filter(fieldsAndValues, field => field.value) || [];

    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <div className="user-info">
            { nonNullFields.map((field, index) => <UserInfoField key={index} title={field.title}>{field.value}</UserInfoField>) }
          </div>
        </Error>
      </LoadingPanel>
    );
  }
}
