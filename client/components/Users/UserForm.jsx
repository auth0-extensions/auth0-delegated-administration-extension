import React, { PropTypes, Component } from 'react';
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
    createMemberships: PropTypes.boolean,
    getDictValue: React.PropTypes.func,
    hasSelectedConnection: PropTypes.string,
    hasMembership: PropTypes.array,
    onClose: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.boolean,
    customFields: React.PropTypes.array,
    customFieldGetter: React.PropTypes.func.isRequired
  }

  renderUsername(connections, hasSelectedConnection) {
    const selectedConnection = _.find(connections, (conn) => conn.name === hasSelectedConnection);
    const requireUsername = selectedConnection && selectedConnection.options ? selectedConnection.options.requires_username : false;
    if (!requireUsername && (!this.props.initialValues || !this.props.initialValues.username)) {
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

  renderConnections(connections, customFields) {
    if (!connections || connections.length <= 1) {
      return null;
    }

    const connectionUserField = _.find(customFields, { property: 'connection' });
    const displayConnectionUserField = connectionUserField && !!connectionUserField.create;

    if (displayConnectionUserField) {
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

    return null;
  }

  renderPassword(customFields) {
    const passwordField = _.find(customFields, { property: 'password' });
    const displayField = passwordField && !!passwordField.create;

    if (displayField) {
      return (
        <div>
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
        </div>
      );
    }
    return null;
  }

  renderEmail(customFields) {
    const emailField = _.find(customFields, { property: 'email' });
    const displayField = emailField && !!emailField.create;

    if (displayField) {
      return (
        <Field
          label="Email"
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

    const connectionUserField = _.find(this.props.customFields, { property: 'connection' });
    const displayConnectionUserField = connectionUserField && !!connectionUserField.display;

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <div className="form-horizontal">
            {this.renderMemberships(hasMembership, memberships, createMemberships)}
            {this.renderEmail(customFields)}
            {this.renderUsername(connections, hasSelectedConnection)}
            {this.renderPassword(customFields)}
            {this.renderConnections(connections, customFields) }
            <UserCustomFormFields customFieldGetter={this.props.customFieldGetter} customFields={customFields} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={submitting} onClick={this.props.handleSubmit}>
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
