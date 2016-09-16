import React, { PropTypes, Component } from 'react';
import { Error, LoadingPanel } from '../Dashboard';
import moment from 'moment';

export default class UserInfo extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    memberships: PropTypes.array
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.memberships !== this.props.memberships || nextProps.loading !== this.props.loading;
  }

  getDepartments = (memberships) => {
    const meta = memberships || [];
    return meta.join(', ');
  };

  getIdentities = (user) => {
    if (user.size === 0) return {};
    return user.get('identities').toJSON()[0];
  };

  getBlocked = (user) => {
    if (user.size === 0) return '';
    return user.get('blocked') ? 'Yes' : 'No';
  };

  render() {
    const { user, error, loading, memberships } = this.props;
    const departments = this.getDepartments(memberships);
    const identities = this.getIdentities(user);
    const blocked = this.getBlocked(user);
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <div>
            <div className="userInfoBlock userInfoBlock_1">
              <div><h5>User Id</h5>{user.get('user_id')}</div>
              <div><h5>Name</h5>{user.get('name')}</div>
              <div><h5>Email</h5>{user.get('email')}</div>
              <div><h5>Blocked</h5>{blocked}</div>
            </div>
            <div className="userInfoBlock userInfoBlock_2">
              <div><h5>Last Ip</h5>{user.get('last_ip')}</div>
              <div><h5>Logins Count</h5>{user.get('logins_count')}</div>
              <div><h5>Memberships</h5>{departments}</div>
              <div><h5>Identities</h5>
                <span>Connection: </span> {identities.connection}<br />
                <span>User Id: </span> {identities.user_id}<br />
                <span>Provider: </span> {identities.provider}<br />
                <span>Is Social: </span> {identities.isSocial ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="userInfoBlock userInfoBlock_3">
              <div><h5>Signed Up</h5>{moment(user.get('created_at')).fromNow()}</div>
              <div><h5>Profile Update</h5>{moment(user.get('updated_at')).fromNow()}</div>
              <div><h5>Last Login</h5>{moment(user.get('last_login')).fromNow()}</div>
            </div>
          </div>
        </Error>
      </LoadingPanel>
    );
  }
}
