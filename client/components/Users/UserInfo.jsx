import _ from 'lodash';
import moment from 'moment';
import React, { PropTypes, Component } from 'react';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import './UserInfo.css';
import UserInfoField from './UserInfoField';

export default class UserInfo extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    memberships: PropTypes.array,
    userInfoFields: PropTypes.array
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user
      || nextProps.memberships !== this.props.memberships
      || nextProps.userInfoFields !== this.props.userInfoFields
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

  findprop(obj, path) {
    var args = path.split('.'), i, l;

    for (i=0, l=args.length; i<l; i++) {
      if (!obj.hasOwnProperty(args[i]))
        return;
      obj = obj[args[i]];
    }

    return obj;
  }

  getValue(user, field) {
    if (user.size === 0) {
      return null;
    }

    let value = this.findprop(user, field.property);
    if (!value) return null;

    if (field.type && field.type === 'elapsedTime') {
      value = moment(value).fromNow();
    }

    return value;
  }

  render() {
    const { user, error, loading, memberships } = this.props;
    const excludeCustomFields = ( this.props.userInfoFields && this.props.userInfoFields.excludeFields ) || [];
    const extraDisplayFields = ( this.props.userInfoFields && this.props.userInfoFields.extraDisplayFields ) || [];
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

    const fieldInfo = _.concat(defaultFieldInfo, extraDisplayFields);

    const fieldProperties = _.map(fieldInfo, 'property');
    const excludeFields = _.concat(fieldProperties, [ 'identity', 'identities', 'app_metadata', 'picture' ], excludeCustomFields);
    const extraFields = _.keys(_.omit(userObject, excludeFields));

    const fields = _.concat(
      _.filter(fieldInfo, (field) => excludeCustomFields.indexOf(field.property) < 0),
      _.map(extraFields, (fieldName) => { return { title: fieldName, property: fieldName }}));

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
