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
    customFields: PropTypes.array
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user
      || nextProps.memberships !== this.props.memberships
      || nextProps.customFields !== this.props.customFields
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

  renderUsername(username) {
    if (!username) {
      return null;
    }

    return (
      <UserInfoField title="Username">{username}</UserInfoField>
    );
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

  render() {
    const { user, error, loading, memberships } = this.props;
    const customFields = this.props.customFields ? _.filter(this.props.customFields, (field) => field.display) : [];
    const currentMemberships = this.getMemberships(memberships);
    const identity = this.getIdentities(user);
    const blocked = this.getBlocked(user);
    const defaultFields = [ 'user_id', 'name', 'username', 'email', 'identities', 'app_metadata', 'created_at', 'email_verified', 'picture', 'updated_at' ];
    const extraFields = _.keys(_.omit(user.toJS(), defaultFields));
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <div className="user-info">
            <UserInfoField title="User ID">{user.get('user_id')}</UserInfoField>
            <UserInfoField title="Name">{user.get('name')}</UserInfoField>
            {this.renderUsername(user.get('username'))}
            <UserInfoField title="Email">{user.get('email')}</UserInfoField>
            <UserInfoField title="Identity">{identity.connection}</UserInfoField>
            <UserInfoField title="Blocked">{blocked}</UserInfoField>
            <UserInfoField title="Last IP">{user.get('last_ip')}</UserInfoField>
            <UserInfoField title="Logins Count">{user.get('logins_count')}</UserInfoField>
            <UserInfoField title="Memberships">{currentMemberships}</UserInfoField>
            <UserInfoField title="Signed Up">{moment(user.get('created_at')).fromNow()}</UserInfoField>
            <UserInfoField title="Updated">{moment(user.get('updated_at')).fromNow()}</UserInfoField>
            <UserInfoField title="Last Login">{moment(user.get('last_login')).fromNow()}</UserInfoField>
            {extraFields.map((item) =>
              <UserInfoField title={item}>{user.get(item)}</UserInfoField>
            )}
            {customFields.map((item) => {
              const fieldName = item.storageLocation || `app_metadata.${item.name}`;
              const value = this.findprop(user.toJS(), fieldName);

              return <UserInfoField title={item.name}>{value}</UserInfoField>;
            })}
          </div>
        </Error>
      </LoadingPanel>
    );
  }
}
