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
  }

  renderUsername(connections, hasSelectedConnection, customFields) {
    const usernameField = _.find(customFields, { property: 'username' });
    const displayField = !usernameField || usernameField.create;

    if (displayField) {
      const selectedConnection = _.find(connections, (conn) => conn.name === hasSelectedConnection);
      const requireUsername = selectedConnection && selectedConnection.options ? selectedConnection.options.requires_username : false;
      if (!requireUsername && (!this.props.initialValues || !this.props.initialValues.username)) {
        return null;
      }

      return (
        <Field label={usernameField && usernameField.label || "Username"} name="username" component={InputText}/>
      );
    }

    return null;
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
      <Field
        name="memberships"
        id="memberships"
        label={this.props.getDictValue('memberships', 'Memberships')}
        component={Multiselect}
        loadOptions={(input, callback) => {
          callback(null, {
            options: allMemberships.map(m => ({ value: m, label: m })),
            complete: true
          });
        }}
      />
    );
  }

  renderConnections(connections, customFields) {
    if (!connections || connections.length <= 1) {
      return null;
    }

    const connectionUserField = _.find(customFields, { property: 'connection' });
    const displayConnectionUserField = !connectionUserField || connectionUserField.create;

    if (displayConnectionUserField) {
      const options = connections.map(conn => ({ value: conn.name, text: conn.name }));
      return (
        <Field
          label={connectionUserField && connectionUserField.label || "Connection"}
          name="connection"
          id="connection"
          component={InputCombo}
          options={options}
          onChange={this.onConnectionChange}
        />
      );
    }

    return null;
  }

  renderPassword(customFields) {
    const passwordField = _.find(customFields, { property: 'password' });
    const repeatPasswordField = _.find(customFields, { property: 'repeatPassword' });
    const displayField = !passwordField || passwordField.create;

    if (displayField) {
      return (
        <div>
          <Field
            label={passwordField && passwordField.label || "Password"}
            name="password"
            type="password"
            component={InputText}
          />
          <Field
            label={repeatPasswordField && repeatPasswordField.label || "Repeat Password"}
            name="repeatPassword"
            type="password"
            component={InputText}
          />
        </div>
      );
    }
    return null;
  }

  renderEmail(customFields) {
    const emailField = _.find(customFields, { property: 'email' });
    const displayField = !emailField || emailField.create;

    if (displayField) {
      return (
        <Field
          label={ emailField && emailField.label || "Email"}
          name="email"
          component={InputText}
        />
      );
    }
    return null;
  }

  render() {
    const connections = this.props.connections;

    const {
      submitting,
      memberships,
      createMemberships,
      hasSelectedConnection,
      hasMembership,
      customFields
    } = this.props;

    const languageDictionary = this.props.languageDictionary || {};

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <div className="form-horizontal">
            {this.renderMemberships(hasMembership, memberships, createMemberships)}
            {this.renderEmail(customFields)}
            {this.renderUsername(connections, hasSelectedConnection, customFields)}
            {this.renderPassword(customFields)}
            {this.renderConnections(connections, customFields)}
            <UserCustomFormFields customFieldGetter={this.props.customFieldGetter} customFields={customFields}/>
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
