import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { InputText, InputCombo, Multiselect, Select } from 'auth0-extension-ui';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import UserCustomFormFields from './UserCustomFormFields';

class AddUserForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    connections: PropTypes.array.isRequired,
    memberships: PropTypes.array.isRequired,
    createMemberships: PropTypes.bool,
    getDictValue: PropTypes.func,
    hasSelectedConnection: PropTypes.string,
    hasMembership: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    customFields: PropTypes.array,
    customFieldGetter: PropTypes.func.isRequired,
    languageDictionary: PropTypes.object,
  };

  addUsernameField(fields) {
    const {
      connections,
      hasSelectedConnection,
      initialValues
    } = this.props;

    const selectedConnection = _.find(connections, (conn) => conn.name === hasSelectedConnection);
    const requireUsername = selectedConnection && selectedConnection.options ? selectedConnection.options.requires_username : false;
    if (!requireUsername && (!initialValues || !initialValues.username)) {
        return _.remove(fields, { property: 'username' });
    }

    const defaults = {
      property: 'username',
      label: 'Username',
      create: true
    };

    const usernameField = _.find(fields, { property: 'username' });
    if (usernameField) return _.defaults(usernameField, defaults);
    return fields.unshift(defaults);
  }

  addMembershipsField(fields) {
    const {
      hasMembership,
      memberships,
      createMemberships,
    } = this.props;

    const allMemberships = _(memberships || [])
      .concat(hasMembership)
      .uniq()
      .sort()
      .value();

    if (allMemberships.length <= 1 && !createMemberships) {
      return _.remove(fields, { property: 'memberships' });
    }

    const defaults = {
      property: 'memberships',
      label: this.props.getDictValue('memberships', 'Memberships'),
      create: {
        type: 'select',
        component: 'InputMultiCombo',
        options: allMemberships.map(m => ({ value: m, label: m }))
      }
    };

    const index = _.findIndex(fields, 'property', 'memberships');
    if (index >= 0) return _.defaults(fields[index], defaults);

    fields.unshift(defaults);
  }

  addConnectionsField(fields) {
    const connections = this.props.connections;
    if (!connections || connections.length <= 1) {
      return _.remove(fields, (field) => field.property === 'connection');
    }

    const defaults = {
      property: 'connection',
      label: 'Connection',
      create: {
        type: 'select',
        component: 'InputCombo',
        options: connections.map(conn => ({ value: conn.name, text: conn.name })),
        onChange: this.onConnectionChange
      }
    };

    const field = _.find(fields, { property: 'connection' });
    if (field) return _.defaults(field, defaults);
    fields.unshift(defaults);
  }

  addPasswordFields(fields) {
    const defaults = {
      create: {
        type: 'password',
        component: 'InputText'
      }
    };

    const repeatPasswordField = _.find(fields, { property: 'repeatPassword' });
    const repeatDefaults = _.assign({}, defaults, { validationFunction: (value, values) => (value !== values.password ? 'passwords must match' : false ) });
    if (repeatPasswordField) {
      _.defaults(repeatPasswordField, { property: 'repeatPassword', label: 'Repeat Password' }, repeatDefaults);
    } else {
      fields.unshift(_.assign({}, { property: 'repeatPassword', label: 'Repeat Password' }, repeatDefaults));
    }

    const passwordField = _.find(fields, { property: 'password' });
    if (passwordField) {
      _.defaults(passwordField, { property: 'password', label: 'Password' }, defaults);
    } else {
      fields.unshift(_.assign({}, { property: 'password', label: 'Password' }, defaults));
    }
  }

  addEmailField(fields) {
    const defaults = {
      property: 'email',
      label: 'Email',
      create: {
        type: 'text',
        component: InputText,
        required: true
      }
    };

    const field = _.find(fields, { property: 'email' });
    if (field) return _.defaults(field, defaults);
    fields.unshift(defaults);
  }

  render() {

    const {
      submitting,
      customFields
    } = this.props;

    const languageDictionary = this.props.languageDictionary || {};

    /* First let's add field to the top if not in the list of fields */
    const fields = _.cloneDeep(customFields) || [];
    this.addConnectionsField(fields);
    this.addPasswordFields(fields);
    this.addUsernameField(fields);
    this.addEmailField(fields);
    this.addMembershipsField(fields);

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <div className="form-horizontal">
            <UserCustomFormFields isEditForm={false} fields={fields} languageDictionary={languageDictionary}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="default" disabled={submitting} onClick={this.props.onClose}>
            {languageDictionary.cancelButtonText || 'Cancel'}
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={submitting} onClick={this.props.handleSubmit}>
            {languageDictionary.createButtonText || 'Create'}
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
