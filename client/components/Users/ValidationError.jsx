import _ from 'lodash';
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import './ValidationError.styles.css';

class ValidationError extends Component {
  getPlainFields = (data) => {
    const fields = [];
    _.forEach(data, (item, name)=> fields.push(this.getField(item, name)));
    return _.flattenDeep(fields);
  };

  getField = (item, name, parentName) => {
    const property = (parentName) ? `${parentName}.${name}` : name;
    const customField = _.find(this.props.customFields, { property });
    const label = (customField && customField.label) || name;

    if (typeof item === 'string') {
      return { property, label };
    }

    if (typeof item === 'object') {
      const result = [];
      _.forEach(item, (value, key)=> result.push(this.getField(value, key, property)));
      return result;
    }
  };

  renderLabel = (property, label) => {
    return <li><label htmlFor={property}>{label}</label></li>
  };

  render() {
    if (this.props.userForm && this.props.userForm.user && this.props.userForm.user.submitFailed && this.props.userForm.user.syncErrors) {
      const fields = this.getPlainFields(this.props.userForm.user.syncErrors);
      return <Alert bsStyle="danger" className="validation-error">
          <h4>{this.props.errorMessage || 'Validation Error'}</h4>
          <ul className="validation-error-fields-list">
            {fields.map(field => this.renderLabel(field.property, field.label))}
          </ul>
        </Alert>;
    }

    return <div />;
  }
}

ValidationError.propTypes = {
  userForm: React.PropTypes.object.required,
  customFields: React.PropTypes.array.required,
  errorMessage: React.PropTypes.string
};

export default ValidationError;
