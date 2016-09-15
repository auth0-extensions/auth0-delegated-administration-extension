import React, { PropTypes, Component } from 'react';
import { Error, LoadingPanel } from '../Dashboard';

export default class UserInfo extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    const { user, error, loading } = this.props;
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <div className="userInfoBlock">
            <h3>Name</h3>{user.name}
            <h3>Name</h3>{user.name}
            <h3>Name</h3>{user.name}
          </div>
          <div className="userInfoBlock">
            <h3>Name</h3>{user.name}
            <h3>Name</h3>{user.name}
            <h3>Name</h3>{user.name}
          </div>
          <div className="userInfoBlock">
            <h3>Name</h3>{user.name}
            <h3>Name</h3>{user.name}
            <h3>Name</h3>{user.name}
          </div>
        </Error>
      </LoadingPanel>
    );
  }
}
