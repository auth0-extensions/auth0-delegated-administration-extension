import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { InputText, InputCombo, Multiselect, Select } from 'auth0-extension-ui';
import { Field } from 'redux-form';

import requiredValidationFunction from '../../utils/requiredValidationFunction';

export default class UserFormField extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    isEditField: PropTypes.bool.isRequired,
    languageDictionary: PropTypes.object
  };

  getFieldComponent(field, component, additionalOptions) {
    const languageDictionary = this.props.languageDictionary || {};
    const requiredLabel = languageDictionary.requiredFieldLabel || ' (required)';
    const label = (languageDictionary.labels && languageDictionary.labels[field.property]) || field.label;
    return (
      <Field
        name={field.property}
        type={field.type}
        label={label + (field.required ? requiredLabel : '')}
        placeholder={field.placeholder}
        component={component}
        {...additionalOptions}
      />
    );
  }

  getFieldByComponentName(field, componentName) {
    const validate = (field.required || field.validationFunction) ? [] : undefined;
    if (field.required) validate.push(requiredValidationFunction(this.props.languageDictionary || {}));
    if (field.validationFunction) {
      validate.push((value, values, context) => field.validationFunction(value, values, context, this.props.languageDictionary || {}));
    }

    switch (componentName) {
      case 'InputCombo': {
        const additionalOptions = {
          options: field.options ? _.map(field.options, option => ({ value: option.value, text: option.label })) : null
        };
        if (validate) additionalOptions.validate = validate;
        return (this.getFieldComponent(field, InputCombo, additionalOptions));
      }
      case 'InputMultiCombo': {
        const additionalOptions = {
          loadOptions: (input, callback) => callback(null, { options: field.options || [], complete: true }),
          multi: true,
          displayLabelOnly: field.displayLabelOnly
        };
        if (validate) additionalOptions.validate = validate;
        return (this.getFieldComponent(field, Multiselect, additionalOptions));
      }
      case 'InputSelectCombo': {
        const additionalOptions = {
          loadOptions: (input, callback) => callback(null, { options: field.options || [], complete: true }),
          multi: false
        };
        if (validate) additionalOptions.validate = validate;
        return (this.getFieldComponent(field, Select, additionalOptions));
      }
      default: {
        const additionalOptions = {
          disabled: field.disabled || false
        };
        if (validate) additionalOptions.validate = validate;
        return (this.getFieldComponent(field, InputText, additionalOptions));
      }
    }
  }

  render() {
    const { field, isEditField } = this.props;
    const formType = isEditField ? 'edit' : 'create';

    /* End early if property is not defined or edit/create is not defined */
    if (field.disable) return null;
    if (!field.property || !field[formType]) return null;

    /* Add some default behavior */
    if (!field.label) field.label = field.property;
    if (field[formType].type === 'hidden') field.label = '';
    if (!_.isFunction(field[formType].validationFunction) && field[formType].validationFunction) {
      console.warn(`WARNING: validation function for field: ${field.label}(${field.property}) is not a function`);
      delete field[formType].validationFunction;
    }
    const finalField = _.isBoolean(field[formType]) ?
      Object.assign({}, field, {
        type: 'text',
        component: 'InputText'
      }) : Object.assign({}, field, field[formType]);

    return (
      <div>
        {this.getFieldByComponentName(finalField, finalField.component)}
      </div>
    );
  }
};
