import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Error, LoadingPanel } from 'auth0-extension-ui';

import './UserInfo.styles.css';
import UserInfoField from './UserInfoField';
import { getValue } from '../../utils/display';
import getErrorMessage from '../../utils/getErrorMessage';

export default class UserInfo extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    memberships: PropTypes.array,
    userFields: PropTypes.array,
    languageDictionary: PropTypes.object
  };

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
  };

  getIdentities = (user) => {
    if (user.size === 0) return {};
    return user.get('identities').toJSON()[0];
  };

  getBlocked = (user, languageDictionary) => {
    if (user.size === 0) return '';
    return user.get('blocked') ? (languageDictionary.yesLabel || 'Yes') : (languageDictionary.noLabel || 'No');
  };

  render() {
    const { user, error, loading, memberships, settings } = this.props;
    const languageDictionary = this.props.languageDictionary || {};
    const labels = languageDictionary.labels || {};

    /* First let's grab the custom fields */
    const customDisplayFields =
      _(this.props.userFields || [])
        .filter(field => field.display)
        .map(field => {
          return {
            title: labels[field.property] || field.label || field.property,
            property: field.property,
            display: field.display
          };
        })
        .value();

    /* We will need to know which fields are explicitly rejected for display */
    let nonDisplayFieldProperties =
      _(this.props.userFields || [])
        .filter(field => field.display === false)
        .groupBy(field => field.property)
        .value();

    let customDisplayFieldProperties = _(customDisplayFields).groupBy(field => field.property).value();

    const defaultFields = [
      { title: 'User ID', property: 'user_id' },
      { title: 'Name', property: 'name' },
      { title: 'Username', property: 'username' },
      { title: 'Email', property: 'email' },
      { title: 'Identity', property: 'identity.connection' },
      { title: 'Blocked', property: 'isBlocked' },
      { title: 'Last IP', property: 'last_ip' },
      { title: 'Logins Count', property: 'logins_count' },
      { title: 'Memberships', property: 'currentMemberships' },
      { title: 'Signed Up', property: 'created_at', type: 'elapsedTime' },
      { title: 'Updated', property: 'updated_at', type: 'elapsedTime' },
      { title: 'Last Login', property: 'last_login', type: 'elapsedTime' }
    ];

    const defaultFieldInfo = defaultFields.map((field) => {
      field.title = labels[field.property] || field.title;
      return field;
    });

    const standardFields = _(defaultFieldInfo).reject(field => field.property in customDisplayFieldProperties || field.property in nonDisplayFieldProperties).value();
    const standardFieldProperties = _(standardFields).groupBy(field => field.property).value();

    /* Now allow for the extra fields that show up from identities */
    const excludeProperties = _(customDisplayFieldProperties) // ignore the custom fields
      .keys()
      .concat(Object.keys(standardFieldProperties)) // ignore the standard fields
      .concat(Object.keys(nonDisplayFieldProperties)) // ignore fields that have explicitly been rejected
      .concat(['identity', 'identities', 'app_metadata', 'picture', 'user_metadata']) // always ignore these
      .value();

    /* Prepare the user object */
    const userObject = user.toJS();
    if (!userObject || Object.keys(userObject).length === 0) {
      return (
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
        </LoadingPanel>
      );
    }

    userObject.currentMemberships = this.getMemberships(memberships);
    userObject.identity = this.getIdentities(user);
    userObject.isBlocked = this.getBlocked(user, languageDictionary);

    /* Grab all user properties that haven't been rejected or already used */
    const extraFieldProperties = _.keys(_.omit(userObject, excludeProperties));

    /* Turn those properties into new field display objects */
    const extraFields = _.map(extraFieldProperties, property => ({ title: property, property }));

    /* Now put all fields together */
    const fields = _(customDisplayFields)
      .concat(standardFields)
      .concat(extraFields)
      .filter(field => field.property !== 'picture')
      .sortBy(field => field.title)
      .value();

    const fieldsAndValues = _.map(fields, (field) => {
      field.value = getValue(userObject, field, languageDictionary);
      return field;
    });
    const nonNullFields = _.filter(fieldsAndValues, field => field.value) || [];

    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
        <div className="user-info">
          {nonNullFields.map((field, index) => <UserInfoField key={index}
                                                              title={field.title}>{field.value}</UserInfoField>)}
        </div>
      </LoadingPanel>
    );
  }
}
