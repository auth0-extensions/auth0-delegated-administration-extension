import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { InputText, InputCombo, Multiselect, Select, VirtualizedSelect } from '@a0/auth0-extension-ui';
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

  // Keep these as stable methods, not inline arrow functions. redux-form
  // compares validators by reference, so a fresh function on every render makes
  // it re-register the field and loop forever. See https://github.com/redux-form/redux-form/issues/4148
  validateRequired = (value) =>
    requiredValidationFunction(this.props.languageDictionary || {})(value);

  validateCustom = (value, values, context) => {
    const { field, isEditField, languageDictionary } = this.props;
    const settings = field[isEditField ? 'edit' : 'create'];
    return settings.validationFunction(value, values, context, languageDictionary || {});
  };

  getFieldByComponentName(field, componentName) {
    const validate = (field.required || field.validationFunction) ? [] : undefined;
    if (field.required) validate.push(this.validateRequired);
    if (field.validationFunction) validate.push(this.validateCustom);

    switch (componentName) {
      case 'InputCombo': {
        const additionalOptions = {
          options: field.options ? _.map(field.options, option => ({ value: option.value, text: option.label })) : null
        };
        if (validate) additionalOptions.validate = validate;
        return (this.getFieldComponent(field, InputCombo, additionalOptions));
      }
      case 'InputMultiCombo': {
        const normalizedOptions = (field.options || []).map(o =>
          (o !== null && typeof o === 'object') ? o : { value: o, label: o }
        );
        const additionalOptions = {
          loadOptions: (input, callback) => callback(normalizedOptions),
          multi: true,
          displayLabelOnly: field.displayLabelOnly
        };
        if (validate) additionalOptions.validate = validate;
        return (this.getFieldComponent(field, Multiselect, additionalOptions));
      }
      case 'InputSelectCombo': {
        const normalizedOptions = (field.options || []).map(o =>
          (o !== null && typeof o === 'object') ? o : { value: o, label: o }
        );
        const additionalOptions = {
          loadOptions: (input, callback) => callback(normalizedOptions),
          multi: false
        };
        if (validate) additionalOptions.validate = validate;
        return (this.getFieldComponent(field, Select, additionalOptions));
      }
      case 'InputVirtualizedSelect': {
        const additionalOptions = {
          options: field.options,
          multi: field.multi,
          displayLabelOnly: field.displayLabelOnly
        };
        if (validate) additionalOptions.validate = validate;
        return (this.getFieldComponent(field, VirtualizedSelect, additionalOptions));
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
