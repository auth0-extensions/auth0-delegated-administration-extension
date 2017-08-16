import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { InputText, InputCombo, Multiselect, Select } from 'auth0-extension-ui';
import { Field } from 'redux-form';

export default class UserCustomFormFields extends Component {
  static propTypes = {
    customFields: React.PropTypes.string,
    customFieldGetter: React.PropTypes.func.isRequired
  };

  getFieldComponent(field, component, additionalOptions) {
    return (
      <Field
        name={field.property}
        type={field.type}
        label={field.label}
        component={component}
        {...additionalOptions}
      />
    );
  }

  getFieldByComponentName(field, componentName) {
    switch (componentName) {
      case 'InputCombo': {
        const additionalOptions = {
          options: field.options ? _.map(field.options, option => ({ value: option.value, text: option.label })) : null
        };
        return (this.getFieldComponent(field, InputCombo, additionalOptions));
      }
      case 'InputMultiCombo': {
        const additionalOptions = {
          loadOptions: (input, callback) => callback(null, { options: field.options || [], complete: true }),
          name: field.property,
          multi: true
        };
        return (this.getFieldComponent(field, Multiselect, additionalOptions));
      }
      case 'InputSelectCombo': {
        const additionalOptions = {
          loadOptions: (input, callback) => callback(null, { options: field.options || [], complete: true }),
          multi: false,
          name: field.property
        };
        return (this.getFieldComponent(field, Select, additionalOptions));
      }
      default: {
        const additionalOptions = {
          disabled: field.disabled || false
        };
        return (this.getFieldComponent(field, InputText, additionalOptions));
      }
    }
  }

  renderCustomFields(customFields) {
    return _.map(customFields, field => ((this.getFieldByComponentName(field, field.component))));
  }

  render() {
    const customFields = _(this.props.customFields)
      .filter(field => _.isObject(this.props.customFieldGetter(field)) || (_.isBoolean(this.props.customFieldGetter(field)) && this.props.customFieldGetter(field) === true))
      .map((field) => {
        if (_.isBoolean(this.props.customFieldGetter(field)) && this.props.customFieldGetter(field) === true) {
          const defaultField = Object.assign({}, field, {
            type: 'text',
            component: 'InputText'
          });
          return defaultField;
        }

        const customField = Object.assign({}, field, this.props.customFieldGetter(field));
        return customField;
      })
      .value();

    return (
      <div>
        {this.renderCustomFields(customFields)}
      </div>
    );
  }
};
