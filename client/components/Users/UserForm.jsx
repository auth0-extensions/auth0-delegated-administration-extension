import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { InputText, InputCombo, Multiselect } from 'auth0-extension-ui';
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
    customfields: React.PropTypes.string
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
        label="Interval"
        name="connection"
        id="connection"
        component={InputCombo}
        options={options}
        onChange={this.onConnectionChange}
      />
    );
  }

  getFieldComponent(componentName) {
    switch (componentName) {
      case 'InputText': {
        return InputText;
      }
      case 'InputCombo': {
        return InputCombo;
      }
      default: {
        return InputText;
      }
    }
  }

  renderCustomFields(customfields) {
    if (customfields) {
      const fields = JSON.parse(customfields);
      return (
        <div>
          { _.map(fields, (field) => ((
            <Field
              name={field.name}
              type={field.type}
              label={field.label}
              component={this.getFieldComponent(field.component)}
              options={field.options ? _.map(field.options, (i) => ({ value: i, text: i })) : null}
            />
          )
          ))}
        </div>
      );
    }

    return null;
  }

  render() {
    const connections = this.props.connections;
    const customfields = this.props.customfields;
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
            {this.renderCustomFields(customfields)}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={submitting} onClick={handleSubmit}>
            Create
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
