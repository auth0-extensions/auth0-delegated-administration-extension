import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import UserFormField from './UserFormField';

export default class UserCustomFormFields extends Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    isEditForm: PropTypes.bool.isRequired,
    languageDictionary: PropTypes.object
  };

  render() {
    const { fields, isEditForm } = this.props;

    return (
      <div>
        {_.map(fields, (field, index) => <UserFormField key={index} field={field} isEditField={isEditForm} languageDictionary={this.props.languageDictionary}/>)}
      </div>
    );
  }
};
