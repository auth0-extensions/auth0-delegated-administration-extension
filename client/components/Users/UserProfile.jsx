import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel } from 'auth0-extension-ui';
import getErrorMessage from '../../utils/getErrorMessage';

export default class UserProfile extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.error !== this.props.error || nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    const { user, error, loading } = this.props;
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error title={this.props.languageDictionary.errorTitle} message={getErrorMessage(this.props.languageDictionary.errors, error)} >
          <Json jsonObject={user.toJS()} />
        </Error>
      </LoadingPanel>
    );
  }
}
