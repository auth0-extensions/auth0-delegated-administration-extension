import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import UserFormField from './UserFormField';

class UserFieldsFormBase extends Component {
  static propTypes = {
    isEditForm: PropTypes.bool.isRequired,
    fields: PropTypes.array.isRequired,
    languageDictionary: PropTypes.object
  };

  render() {
    const { fields, isEditForm } = this.props;

    const languageDictionary = this.props.languageDictionary || {};

    return (
      <div className="row">
        {fields.map((field, index) =>
          <UserFormField
            key={index}
            field={field}
            isEditField={isEditForm}
            languageDictionary={languageDictionary}/>)
        }
      </div>
    );
  }
};

export const UserFieldsForm = (name, submit) => reduxForm({ form: name, onSubmit: submit })(UserFieldsFormBase);
export default UserFieldsForm;