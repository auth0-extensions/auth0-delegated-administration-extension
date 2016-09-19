import moment from 'moment';
import React, { PropTypes, Component } from 'react';

import './UserInfo.css';
import UserInfoField from './UserInfoField';
import { Error, LoadingPanel } from '../Dashboard';

export default class UserInfo extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    memberships: PropTypes.array
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user
      || nextProps.memberships !== this.props.memberships
      || nextProps.loading !== this.props.loading
      || nextProps.error !== this.props.error;
  }

  getDepartments = (memberships) => {
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

  render() {
    const { user, error, loading, memberships } = this.props;
    const departments = this.getDepartments(memberships);
    const identity = this.getIdentities(user);
    const blocked = this.getBlocked(user);
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <div className="user-info">
            <UserInfoField title="User ID">{user.get('user_id')}</UserInfoField>
            <UserInfoField title="Name">{user.get('name')}</UserInfoField>
            <UserInfoField title="Email">{user.get('email')}</UserInfoField>
            <UserInfoField title="Identity">{identity.connection}</UserInfoField>
            <UserInfoField title="Blocked">{blocked}</UserInfoField>
            <UserInfoField title="Last IP">{user.get('last_ip')}</UserInfoField>
            <UserInfoField title="Logins Count">{user.get('logins_count')}</UserInfoField>
            <UserInfoField title="Memberships">{departments}</UserInfoField>
            <UserInfoField title="Signed Up">{moment(user.get('created_at')).fromNow()}</UserInfoField>
            <UserInfoField title="Updated">{moment(user.get('updated_at')).fromNow()}</UserInfoField>
            <UserInfoField title="Last Login">{moment(user.get('last_login')).fromNow()}</UserInfoField>
          </div>
        </Error>
      </LoadingPanel>
    );
  }
}
