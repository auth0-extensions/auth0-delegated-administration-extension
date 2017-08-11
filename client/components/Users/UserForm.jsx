import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { InputText, InputCombo, Multiselect, Select } from 'auth0-extension-ui';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';

class AddUserForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    connections: PropTypes.array.isRequired,
    memberships: PropTypes.array.isRequired,
    createMemberships: PropTypes.boolean,
    getDictValue: React.PropTypes.func,
    hasSelectedConnection: PropTypes.string,
    hasMembership: PropTypes.array,
    onClose: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.boolean,
    customFields: React.PropTypes.string,
    customFieldGetter: React.PropTypes.func.isRequired
  }

  renderUsername(connections, hasSelectedConnection) {
    const selectedConnection = _.find(connections, (conn) => conn.name === hasSelectedConnection);
    const requireUsername = selectedConnection && selectedConnection.options ? selectedConnection.options.requires_username : false;
    if (!requireUsername) {
      return null;
    }

    return (
      <Field label="Username" name="username" component={InputText} />
    );
  }

  renderMemberships(hasMembership, memberships, createMemberships) {
    const allMemberships = _(memberships || [])
      .concat(hasMembership)
      .uniq()
      .sort()
      .value();
    if (allMemberships.length <= 1 && !createMemberships) {
      return null;
    }

    return (
      <div>
        <label className="control-label col-xs-3" htmlFor="memberships">
          {this.props.getDictValue('memberships', 'Memberships')}
        </label>
        <div className="col-xs-9" style={{ padding: '0 0 15px 7px' }}>
          <Field
            name="memberships"
            id="memberships"
            component={Multiselect}
            loadOptions={(input, callback) => {
              callback(null, {
                options: allMemberships.map(m => ({ value: m, label: m })),
                complete: true
              });
            }}
          />
        </div>
      </div>
    );
  }

  renderConnections(connections) {
    if (!connections || connections.length <= 1) {
      return null;
    }

    const options = connections.map(conn => ({ value: conn.name, text: conn.name }));

    return (
      <Field
        label="Connection"
        name="connection"
        id="connection"
        component={InputCombo}
        options={options}
        onChange={this.onConnectionChange}
      />
    );
  }

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
    const connections = this.props.connections;
    console.log('Carlos, customFields: ', this.props.customFields);
    const customFields = _(this.props.customFields)
      .filter(field => _.isObject(this.props.customFieldGetter(field)) || (_.isBoolean(this.props.customFieldGetter(field)) && this.props.customFieldGetter(field) === true))
      .map((field) => {
        if (_.isBoolean(this.props.customFieldGetter(field)) && this.props.customFieldGetter(field) === true) {
          const defaultField = Object.assign({}, field, {
            type: 'text',
            component: 'InputText'
          });
          console.log('defaultField', defaultField);
          return defaultField;
        }

        const customField = Object.assign({}, field, this.props.customFieldGetter(field));
        console.log('customField in user form', customField);
        return customField;
      })
      .value();

    const {
      handleSubmit,
      submitting,
      memberships,
      createMemberships,
      hasSelectedConnection,
      hasMembership
    } = this.props;

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <div className="form-horizontal">
            {this.renderMemberships(hasMembership, memberships, createMemberships)}
            <Field
              label="Email"
              name="email"
              component={InputText}
            />
            {this.renderUsername(connections, hasSelectedConnection)}
            <Field
              label="Password"
              name="password"
              type="password"
              component={InputText}
            />
            <Field
              label="Repeat Password"
              name="repeatPassword"
              type="password"
              component={InputText}
            />
            {this.renderConnections(connections)}
            {this.renderCustomFields(customFields)}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={submitting} onClick={handleSubmit}>
            {this.props.method || 'Create'}
          </Button>
        </Modal.Footer>
      </div>
    );
  }
}

const reduxFormDecorator = reduxForm({
  form: 'user'
});

// Decorate with connect to read form values
const selector = formValueSelector('user');
const connectDecorator = connect(state => {
  const hasSelectedConnection = selector(state, 'connection');
  const hasMembership = selector(state, 'memberships');

  return {
    hasSelectedConnection,
    hasMembership
  };
});

export default connectDecorator(reduxFormDecorator(AddUserForm));
