import React, { PropTypes, Component } from 'react';
import { Error, Json, LoadingPanel } from 'auth0-extension-ui';
import getErrorMessage from '../../utils/getErrorMessage';
import { tz_date } from '../../utils/display';

export default class UserProfile extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.error !== this.props.error || nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    const { user, error, loading, settings } = this.props;

    const user_js = user.toJS();

    if(this.props.languageDictionary.timeZone) {
      const locale = this.props.languageDictionary.momentLocale || 'en';
      const timeZone = this.props.languageDictionary.timeZone;
      user_js.created_at = tz_date(user_js.created_at, timeZone, locale);
      user_js.last_login = tz_date(user_js.last_login, timeZone, locale);
      user_js.multifactor_last_modified = tz_date(user_js.multifactor_last_modified, timeZone, locale);
      user_js.updated_at = tz_date(user_js.updated_at, timeZone, locale);
    }

    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error title={this.props.languageDictionary.errorTitle} message={getErrorMessage(this.props.languageDictionary, error, settings.errorTranslator)} >
          <Json jsonObject={user_js} />
        </Error>
      </LoadingPanel>
    );
  }
}
